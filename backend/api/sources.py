from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from backend.db.database import get_db
from backend.models.models import Source
from backend.schemas.schemas import SourceItem

router = APIRouter(prefix="/sources", tags=["Sources & Knowledge"])


@router.get("", response_model=List[SourceItem])
async def list_sources(
    project_id: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = Query(default=50, le=200),
    db: AsyncSession = Depends(get_db)
):
    """List verified sources collected across research runs."""
    stmt = select(Source).order_by(desc(Source.trust_score)).limit(limit)
    if project_id:
        stmt = stmt.where(Source.project_id == project_id)
    if category:
        stmt = stmt.where(Source.category == category)
    
    res = await db.execute(stmt)
    sources = res.scalars().all()
    return [SourceItem.model_validate(s) for s in sources]


@router.get("/domains/credibility")
async def get_domain_credibility_metrics():
    """Returns domain trust reputation matrix."""
    return {
        "domains": [
            {"domain": "nature.com", "category": "Academic", "trust_score": 98.5, "verified_articles": 420},
            {"domain": "ieee.org", "category": "Academic", "trust_score": 96.8, "verified_articles": 380},
            {"domain": "reuters.com", "category": "News", "trust_score": 93.4, "verified_articles": 510},
            {"domain": "gov.in", "category": "Government", "trust_score": 97.2, "verified_articles": 190},
            {"domain": "bloomberg.com", "category": "News", "trust_score": 92.8, "verified_articles": 440},
            {"domain": "mckinsey.com", "category": "Official Company", "trust_score": 91.5, "verified_articles": 210},
            {"domain": "mit.edu", "category": "Academic", "trust_score": 96.0, "verified_articles": 290},
            {"domain": "arxiv.org", "category": "Academic", "trust_score": 91.0, "verified_articles": 650},
        ]
    }
