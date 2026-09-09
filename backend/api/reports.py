import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Response, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload

from backend.db.database import get_db
from backend.models.models import Report, Citation, ResearchProject, User
from backend.schemas.schemas import ReportResponse
from backend.services.export_service import ExportService
from backend.api.auth import get_current_user_optional

router = APIRouter(prefix="/reports", tags=["Reports & Exports"])


@router.get("", response_model=List[ReportResponse])
async def list_reports(
    search: Optional[str] = None,
    limit: int = Query(default=20, le=100),
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """List all completed research reports."""
    stmt = (
        select(Report)
        .options(selectinload(Report.citations))
        .order_by(desc(Report.created_at))
        .limit(limit)
        .offset(offset)
    )
    if search:
        stmt = stmt.where(Report.title.ilike(f"%{search}%"))
    
    res = await db.execute(stmt)
    reports = res.scalars().all()
    return [ReportResponse.model_validate(r) for r in reports]


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(report_id: str, db: AsyncSession = Depends(get_db)):
    """Fetch single report details and formatted citations."""
    stmt = select(Report).options(selectinload(Report.citations)).where(Report.id == report_id)
    res = await db.execute(stmt)
    report = res.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return ReportResponse.model_validate(report)


@router.delete("/{report_id}")
async def delete_report(report_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a report."""
    stmt = select(Report).where(Report.id == report_id)
    res = await db.execute(stmt)
    report = res.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    await db.delete(report)
    await db.commit()
    return {"message": "Report deleted successfully"}


@router.post("/{report_id}/share")
async def share_report(report_id: str, db: AsyncSession = Depends(get_db)):
    """Generate public share token and link for report."""
    res = await db.execute(select(Report).where(Report.id == report_id))
    report = res.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    if not report.share_token:
        report.share_token = str(uuid.uuid4())[:12]
        report.is_public = True
        await db.commit()
        await db.refresh(report)
    
    return {
        "share_token": report.share_token,
        "is_public": report.is_public,
        "share_url": f"/share/{report.share_token}"
    }


@router.get("/public/{share_token}", response_model=ReportResponse)
async def get_public_report(share_token: str, db: AsyncSession = Depends(get_db)):
    """Public read-only view for shared report."""
    stmt = select(Report).options(selectinload(Report.citations)).where(Report.share_token == share_token)
    res = await db.execute(stmt)
    report = res.scalar_one_or_none()
    if not report or not report.is_public:
        raise HTTPException(status_code=404, detail="Shared report not found or link has expired")
    return ReportResponse.model_validate(report)


@router.get("/{report_id}/export/{export_format}")
async def export_report(
    report_id: str,
    export_format: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Export report in designated format: pdf, docx, md, html, json, or csv.
    """
    stmt = select(Report).options(selectinload(Report.citations)).where(Report.id == report_id)
    res = await db.execute(stmt)
    report = res.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    fmt = export_format.lower()
    filename_base = report.title.lower().replace(" ", "_")[:40]

    if fmt in ["md", "markdown"]:
        content = ExportService.export_markdown(report.title, report.full_markdown)
        return Response(
            content=content,
            media_type="text/markdown",
            headers={"Content-Disposition": f'attachment; filename="{filename_base}.md"'}
        )
    
    elif fmt == "html":
        content = ExportService.export_html(report.title, report.full_markdown, {})
        return Response(
            content=content,
            media_type="text/html",
            headers={"Content-Disposition": f'attachment; filename="{filename_base}.html"'}
        )
    
    elif fmt == "pdf":
        content = ExportService.export_pdf(report.title, report.full_markdown, {})
        return Response(
            content=content,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename_base}.pdf"'}
        )
    
    elif fmt in ["docx", "doc"]:
        content = ExportService.export_docx(report.title, report.full_markdown)
        return Response(
            content=content,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f'attachment; filename="{filename_base}.docx"'}
        )
    
    elif fmt == "json":
        data = {
            "id": report.id,
            "title": report.title,
            "executive_summary": report.executive_summary,
            "full_markdown": report.full_markdown,
            "confidence_score": report.confidence_score,
            "quality_score": report.quality_score,
            "fact_check_score": report.fact_check_score,
            "citations": [{"index": c.index_number, "text": c.formatted_text, "url": c.url} for c in report.citations],
            "created_at": report.created_at.isoformat(),
        }
        content = ExportService.export_json(data)
        return Response(
            content=content,
            media_type="application/json",
            headers={"Content-Disposition": f'attachment; filename="{filename_base}.json"'}
        )
    
    elif fmt == "csv":
        citations_data = [{"index_number": c.index_number, "formatted_text": c.formatted_text, "url": c.url, "domain": ""} for c in report.citations]
        content = ExportService.export_csv_citations(citations_data)
        return Response(
            content=content,
            media_type="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{filename_base}_citations.csv"'}
        )
    
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported format '{export_format}'. Use pdf, docx, md, html, json, or csv.")
