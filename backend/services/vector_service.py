import os
import math
from typing import List, Dict, Any, Optional
from loguru import logger
from backend.core.config import settings


class VectorService:
    """
    Vector search and document ingestion service using ChromaDB with fallback in-memory store.
    """

    def __init__(self, persist_directory: Optional[str] = None):
        self.persist_directory = persist_directory or settings.VECTOR_DB_DIR
        self.chroma_client = None
        self.in_memory_docs: Dict[str, List[Dict[str, Any]]] = {}

        try:
            import chromadb
            from chromadb.config import Settings as ChromaSettings
            self.chroma_client = chromadb.PersistentClient(
                path=self.persist_directory,
                settings=ChromaSettings(allow_reset=True, anonymized_telemetry=False)
            )
            logger.info(f"ChromaDB initialized at {self.persist_directory}")
        except Exception as e:
            logger.warning(f"ChromaDB initialization failed ({e}). Using robust in-memory vector store.")

    def ingest_document_chunks(
        self,
        collection_name: str,
        chunks: List[str],
        metadatas: List[Dict[str, Any]],
        ids: List[str],
    ) -> bool:
        """Ingest text chunks into vector store."""
        if self.chroma_client:
            try:
                collection = self.chroma_client.get_or_create_collection(name=collection_name)
                collection.add(
                    documents=chunks,
                    metadatas=metadatas,
                    ids=ids,
                )
                return True
            except Exception as e:
                logger.error(f"ChromaDB add error: {e}")

        # In-memory storage fallback
        if collection_name not in self.in_memory_docs:
            self.in_memory_docs[collection_name] = []
        
        for doc_id, text, meta in zip(ids, chunks, metadatas):
            self.in_memory_docs[collection_name].append({
                "id": doc_id,
                "text": text,
                "metadata": meta,
            })
        return True

    def search_similar(
        self,
        collection_name: str,
        query: str,
        n_results: int = 4,
    ) -> List[Dict[str, Any]]:
        """Query similar chunks from collection."""
        if self.chroma_client:
            try:
                collection = self.chroma_client.get_collection(name=collection_name)
                results = collection.query(
                    query_texts=[query],
                    n_results=min(n_results, collection.count() or 1),
                )
                items = []
                if results and "documents" in results and results["documents"]:
                    docs = results["documents"][0]
                    metas = results.get("metadatas", [[]])[0]
                    distances = results.get("distances", [[]])[0] if "distances" in results else []
                    for i, doc in enumerate(docs):
                        meta = metas[i] if i < len(metas) else {}
                        score = 1.0 - (distances[i] if i < len(distances) else 0.2)
                        items.append({
                            "text": doc,
                            "metadata": meta,
                            "score": max(0.0, score),
                        })
                    return items
            except Exception as e:
                logger.warning(f"ChromaDB query error: {e}")

        # In-memory keyword & term frequency search fallback
        items = []
        docs = self.in_memory_docs.get(collection_name, [])
        query_words = set(query.lower().split())
        
        for item in docs:
            text_words = set(item["text"].lower().split())
            overlap = len(query_words.intersection(text_words))
            if overlap > 0:
                score = min(1.0, 0.5 + (overlap / (len(query_words) + 1)) * 0.5)
                items.append({
                    "text": item["text"],
                    "metadata": item["metadata"],
                    "score": score,
                })
        
        items.sort(key=lambda x: x["score"], reverse=True)
        return items[:n_results]

    def extract_and_chunk_file(self, file_path: str, chunk_size: int = 1000, overlap: int = 150) -> List[str]:
        """Extract text from PDF, DOCX, TXT, MD and chunk it."""
        text = ""
        ext = os.path.splitext(file_path)[1].lower()

        try:
            if ext in [".txt", ".md", ".json"]:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    text = f.read()
            elif ext == ".pdf":
                try:
                    import pypdf
                    reader = pypdf.PdfReader(file_path)
                    text = "\n".join([page.extract_text() or "" for page in reader.pages])
                except ImportError:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        text = f.read()
            elif ext in [".docx", ".doc"]:
                try:
                    import docx
                    doc = docx.Document(file_path)
                    text = "\n".join([p.text for p in doc.paragraphs])
                except ImportError:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        text = f.read()
            else:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    text = f.read()
        except Exception as e:
            logger.error(f"Error reading file {file_path}: {e}")
            text = f"Content extracted from {os.path.basename(file_path)}"

        # Chunking
        if not text.strip():
            return []

        chunks = []
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunk = text[start:end]
            chunks.append(chunk.strip())
            start += (chunk_size - overlap)

        return chunks
