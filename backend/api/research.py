import asyncio
import json
import uuid
from typing import Optional, AsyncGenerator
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from loguru import logger

from backend.db.database import get_db
from backend.models.models import ResearchProject, Report, User
from backend.schemas.schemas import (
    ResearchStartRequest, ResearchProjectResponse, HumanApprovalRequest
)
from backend.api.auth import get_current_user_optional
from backend.services.research_service import ResearchService
from backend.graph.builder import get_graph_mermaid_diagram

router = APIRouter(prefix="/research", tags=["Research Operations"])


@router.post("/start", response_model=ResearchProjectResponse)
async def start_research(
    request: ResearchStartRequest,
    background_tasks: BackgroundTasks,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """
    Launch autonomous multi-agent research workflow.
    """
    project_id = str(uuid.uuid4())
    opts = request.options.model_dump() if request.options else {}

    project = ResearchProject(
        id=project_id,
        user_id=current_user.id if current_user else None,
        title=f"Strategic Dossier: {request.topic}",
        topic=request.topic,
        status="running",
        depth=opts.get("depth", "standard"),
        language=opts.get("language", "English"),
        citation_style=opts.get("citation_style", "APA"),
        model_provider=opts.get("model_provider", "simulation"),
        model_name=opts.get("model_name", "claude-3-5-sonnet"),
        focus_areas=opts.get("focus_areas", []),
        progress_percentage=5,
        current_agent="Orchestrator Agent",
    )
    db.add(project)
    await db.commit()

    # Eagerly load for response serialization
    stmt = (
        select(ResearchProject)
        .options(
            selectinload(ResearchProject.report).selectinload(Report.citations),
            selectinload(ResearchProject.agent_executions),
            selectinload(ResearchProject.sources),
            selectinload(ResearchProject.logs)
        )
        .where(ResearchProject.id == project_id)
    )
    res = await db.execute(stmt)
    loaded_project = res.scalar_one()

    # Launch background workflow
    background_tasks.add_task(
        ResearchService.run_workflow,
        project_id=project_id,
        topic=request.topic,
        options=opts,
    )

    return ResearchProjectResponse.model_validate(loaded_project)


@router.get("/{project_id}", response_model=ResearchProjectResponse)
async def get_research_project(project_id: str, db: AsyncSession = Depends(get_db)):
    """Fetch complete research project state, executions, sources, and report."""
    stmt = (
        select(ResearchProject)
        .options(
            selectinload(ResearchProject.report).selectinload(Report.citations),
            selectinload(ResearchProject.agent_executions),
            selectinload(ResearchProject.sources),
            selectinload(ResearchProject.logs)
        )
        .where(ResearchProject.id == project_id)
    )
    res = await db.execute(stmt)
    project = res.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Research project not found")
    
    return ResearchProjectResponse.model_validate(project)


@router.get("/stream/{project_id}")
async def stream_research_events(project_id: str):
    """
    Server-Sent Events (SSE) stream for real-time agent thoughts, node status, and log messages.
    """
    queue = ResearchService.get_or_create_stream(project_id)

    async def event_generator() -> AsyncGenerator[str, None]:
        # Send initial connected heartbeat
        yield f"event: connected\ndata: {json.dumps({'message': 'Connected to live multi-agent event stream', 'project_id': project_id})}\n\n"
        
        while True:
            try:
                # Wait for next event or timeout to send heartbeat keep-alive
                event_data = await asyncio.wait_for(queue.get(), timeout=15.0)
                event_type = event_data.get("type", "message")
                yield f"event: {event_type}\ndata: {json.dumps(event_data)}\n\n"
                
                # If terminal event, close stream
                if event_type in ["workflow_complete", "error"]:
                    break
            except asyncio.TimeoutError:
                yield f": heartbeat keep-alive\n\n"
            except Exception as e:
                logger.error(f"SSE stream exception for {project_id}: {e}")
                break

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@router.post("/{project_id}/approve")
async def approve_or_rewrite_research(
    project_id: str,
    approval: HumanApprovalRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Human Approval Node endpoint: Approve, Reject, or Request Rewrite with feedback.
    """
    res = await db.execute(select(ResearchProject).where(ResearchProject.id == project_id))
    project = res.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Research project not found")

    action = approval.action.lower()
    if action == "approve":
        await db.commit()
        report_id = await ResearchService._finalize_project_in_db(project_id)
        await ResearchService.push_event(project_id, "workflow_complete", {
            "status": "completed",
            "project_id": project_id,
            "report_id": report_id,
            "message": "Human reviewer approved draft. Final report published."
        })
        return {
            "status": "approved",
            "project_id": project_id,
            "report_id": report_id,
            "message": "Report finalized and published successfully."
        }
    
    elif action == "rewrite":
        project.status = "rewriting"
        await db.commit()
        
        # Resume workflow with feedback
        background_tasks.add_task(
            ResearchService.run_workflow,
            project_id=project_id,
            topic=project.topic,
            options={
                "depth": project.depth,
                "language": project.language,
                "citation_style": project.citation_style,
                "model_provider": project.model_provider,
                "human_action": "rewrite",
                "human_feedback": approval.feedback or "Please deepen the empirical data and comparisons.",
            }
        )
        return {"status": "rewriting", "message": "Rewrite scheduled with Report Writer agent."}

    elif action == "reject":
        project.status = "cancelled"
        await db.commit()
        await ResearchService.push_event(project_id, "error", {"status": "cancelled", "message": "Project draft rejected by user."})
        return {"status": "rejected", "message": "Research project cancelled."}

    else:
        raise HTTPException(status_code=400, detail="Invalid action. Use 'approve', 'reject', or 'rewrite'.")


@router.get("/graph/definition")
async def get_graph_definition():
    """Returns the visual Mermaid diagram definition of the 9-agent LangGraph workflow."""
    return {"mermaid": get_graph_mermaid_diagram()}
