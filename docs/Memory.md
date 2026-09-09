# Memory, Caching & State Checkpointing

## 1. LangGraph State Checkpointer

LangGraph checkpoints preserve the full state tuple of `ResearchState` at every node boundary.
* In development, `MemorySaver` provides fast in-memory checkpointing.
* In production, the state transitions and graph snapshots are persisted in PostgreSQL via `ResearchProject.graph_state_snapshot`.

---

## 2. Redis TTL Search & Query Cache

Redis is utilized for:
* **Search Result Caching**: Duplicate search queries across agents are cached with a 24-hour TTL to reduce external Tavily and LLM API costs.
* **Celery Message Broker**: Celery distributes concurrent research tasks across background worker threads.

---

## 3. ChromaDB Vector Memory

User-uploaded PDFs, DOCX files, and literature corpora are vectorized using ChromaDB:
* Text chunking with sliding window (1,000 characters with 150-character overlap).
* Semantic cosine similarity search allows the Research Agent to seamlessly blend web evidence with private internal documentation.
