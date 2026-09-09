import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.db.database import get_db
from backend.models.models import UploadedDocument, User
from backend.api.auth import get_current_user_optional
from backend.services.vector_service import VectorService
from backend.core.config import settings

router = APIRouter(prefix="/files", tags=["File & Vector Knowledge"])
vector_service = VectorService()


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload research document (PDF, DOCX, TXT, MD), extract content, and index into ChromaDB vector store.
    """
    file_id = str(uuid.uuid4())
    original_filename = file.filename or "uploaded_document.txt"
    ext = os.path.splitext(original_filename)[1].lower()

    if ext not in [".pdf", ".docx", ".doc", ".txt", ".md", ".json"]:
        raise HTTPException(status_code=400, detail=f"Unsupported file type '{ext}'. Supported: PDF, DOCX, TXT, MD, JSON")

    file_path = os.path.join(settings.UPLOAD_DIR, f"{file_id}_{original_filename}")
    
    # Save file to disk
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    # Chunk and index into vector store
    chunks = vector_service.extract_and_chunk_file(file_path)
    chunk_count = len(chunks)
    collection_id = f"doc_{file_id}"

    if chunks:
        metadatas = [{"filename": original_filename, "file_id": file_id, "chunk_index": i} for i in range(chunk_count)]
        ids = [f"{file_id}_{i}" for i in range(chunk_count)]
        vector_service.ingest_document_chunks(collection_id, chunks, metadatas, ids)

    doc = UploadedDocument(
        id=file_id,
        user_id=current_user.id if current_user else None,
        filename=original_filename,
        file_path=file_path,
        file_type=ext.replace(".", ""),
        file_size_bytes=len(contents),
        chunk_count=chunk_count,
        vector_collection_id=collection_id
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    return {
        "id": doc.id,
        "filename": doc.filename,
        "file_size": doc.file_size_bytes,
        "chunk_count": doc.chunk_count,
        "vector_collection_id": doc.vector_collection_id,
        "message": f"Successfully processed and indexed {chunk_count} text chunks for multi-agent synthesis."
    }


@router.get("")
async def list_uploaded_files(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """List uploaded knowledge documents."""
    stmt = select(UploadedDocument).order_by(UploadedDocument.created_at.desc())
    if current_user:
        stmt = stmt.where(UploadedDocument.user_id == current_user.id)
    res = await db.execute(stmt)
    docs = res.scalars().all()
    return [
        {
            "id": d.id,
            "filename": d.filename,
            "file_type": d.file_type,
            "file_size_bytes": d.file_size_bytes,
            "chunk_count": d.chunk_count,
            "created_at": d.created_at.isoformat(),
        }
        for d in docs
    ]
