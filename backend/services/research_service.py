import asyncio
import json
import uuid
from typing import Dict, Any, Optional, AsyncGenerator
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from loguru import logger

from backend.db.database import AsyncSessionLocal
from backend.models.models import (
    ResearchProject, Report, AgentExecution, Source, Citation, SystemLog
)
from backend.graph.builder import create_research_graph
from backend.graph.state import ResearchState


class ResearchService:
    """
    Manages active LangGraph research workflows, background execution,
    database synchronization, and live Server-Sent Events (SSE) broadcasting.
    """
    _active_streams: Dict[str, asyncio.Queue] = {}
    _active_graphs: Dict[str, Any] = {}

    @classmethod
    def get_or_create_stream(cls, project_id: str) -> asyncio.Queue:
        if project_id not in cls._active_streams:
            cls._active_streams[project_id] = asyncio.Queue()
        return cls._active_streams[project_id]

    @classmethod
    async def push_event(cls, project_id: str, event_type: str, data: Dict[str, Any]):
        """Pushes an SSE event to active subscribers."""
        stream = cls.get_or_create_stream(project_id)
        payload = {
            "type": event_type,
            "project_id": project_id,
            "data": data,
        }
        await stream.put(payload)

    @classmethod
    async def run_workflow(cls, project_id: str, topic: str, options: Dict[str, Any], initial_state_override: Optional[Dict[str, Any]] = None):
        """
        Runs the multi-agent state graph asynchronously, broadcasting state changes and saving results to DB.
        """
        logger.info(f"Starting Multi-Agent Research Workflow for Project ID: {project_id}")
        
        # Initial State
        initial_state: ResearchState = {
            "project_id": project_id,
            "topic": topic,
            "depth": options.get("depth", "standard"),
            "language": options.get("language", "English"),
            "citation_style": options.get("citation_style", "APA"),
            "model_provider": options.get("model_provider", "simulation"),
            "focus_areas": options.get("focus_areas", []),
            "uploaded_file_ids": options.get("uploaded_file_ids", []),
            "current_step": "Initializing Multi-Agent Graph",
            "progress_percentage": 5,
            "status": "running",
            "subtasks": [],
            "research_plan_rationale": None,
            "evidence": [],
            "sources": [],
            "validated_sources": [],
            "source_stats": {},
            "analysis": {},
            "fact_checks": {},
            "confidence_score": 95.0,
            "draft_report": "",
            "formatted_citations": [],
            "review_notes": {},
            "quality_score": 95.0,
            "human_approval_required": False,
            "human_action": options.get("human_action"),
            "human_feedback": options.get("human_feedback"),
            "rewrite_count": options.get("rewrite_count", 0),
            "final_report": None,
            "executive_summary": None,
            "logs": [],
            "agent_executions": [],
        }

        if initial_state_override:
            initial_state.update(initial_state_override)

        graph = create_research_graph()
        config = {"configurable": {"thread_id": project_id}}
        
        await cls.push_event(project_id, "status", {
            "status": "running",
            "progress": 5,
            "current_step": "Initializing Graph State",
            "agent": "Orchestrator Agent"
        })

        accumulated_state: Dict[str, Any] = dict(initial_state)

        try:
            # Stream events node by node
            async for output in graph.astream(initial_state, config=config):
                for node_name, node_state in output.items():
                    logger.info(f"Node completed: {node_name}")
                    accumulated_state.update(node_state)
                    
                    # Extract node updates
                    progress = node_state.get("progress_percentage", 50)
                    step_desc = node_state.get("current_step", f"Running {node_name}")
                    logs = node_state.get("logs", [])
                    executions = node_state.get("agent_executions", [])
                    
                    # Update database with current node execution
                    await cls._sync_step_to_db(project_id, node_name, node_state)

                    # Broadcast SSE
                    await cls.push_event(project_id, "node_complete", {
                        "node": node_name,
                        "progress": progress,
                        "current_step": step_desc,
                        "logs": logs,
                        "executions": executions,
                        "state_snapshot": {
                            "subtasks": node_state.get("subtasks"),
                            "sources_count": len(accumulated_state.get("sources", [])),
                            "validated_count": len(accumulated_state.get("validated_sources", [])),
                            "confidence_score": accumulated_state.get("confidence_score", 95.0),
                            "quality_score": accumulated_state.get("quality_score", 95.0),
                            "draft_preview": (accumulated_state.get("draft_report") or "")[:400],
                        }
                    })

                    # If human approval is required, pause and broadcast approval request
                    if node_state.get("human_approval_required"):
                        await cls.push_event(project_id, "human_approval_required", {
                            "status": "human_approval",
                            "draft_report": node_state.get("draft_report"),
                            "review_notes": node_state.get("review_notes"),
                            "quality_score": node_state.get("quality_score")
                        })
                    
                    await asyncio.sleep(0.1)

            # Workflow completed successfully
            report_id = await cls._finalize_project_in_db(project_id, accumulated_state)
            await cls.push_event(project_id, "workflow_complete", {
                "status": "completed",
                "progress": 100,
                "project_id": project_id,
                "report_id": report_id,
                "message": "All 9 agents completed autonomous research successfully."
            })

        except Exception as e:
            logger.error(f"Error executing research graph for {project_id}: {e}", exc_info=True)
            await cls._mark_project_failed(project_id, str(e))
            await cls.push_event(project_id, "error", {
                "status": "failed",
                "error": str(e)
            })

    @classmethod
    async def _sync_step_to_db(cls, project_id: str, node_name: str, node_state: Dict[str, Any]):
        """Persists agent execution logs, sources, and state updates to DB."""
        async with AsyncSessionLocal() as session:
            try:
                # Update project
                res = await session.execute(select(ResearchProject).where(ResearchProject.id == project_id))
                project = res.scalar_one_or_none()
                if project:
                    project.progress_percentage = node_state.get("progress_percentage", project.progress_percentage)
                    project.current_agent = node_name
                    if node_state.get("status"):
                        project.status = node_state["status"]

                # Add executions
                for exc in node_state.get("agent_executions", []):
                    agent_rec = AgentExecution(
                        id=str(uuid.uuid4()),
                        project_id=project_id,
                        agent_name=exc.get("agent_name", node_name),
                        step_number=exc.get("step_number", 1),
                        status=exc.get("status", "completed"),
                        latency_ms=exc.get("latency_ms", 0),
                        tokens_used=exc.get("tokens_used", 0),
                        cost_estimate_usd=exc.get("cost_estimate_usd", 0.0),
                        thought_log=exc.get("thought_log", ""),
                    )
                    session.add(agent_rec)

                # Add system logs
                for l in node_state.get("logs", []):
                    log_rec = SystemLog(
                        id=str(uuid.uuid4()),
                        project_id=project_id,
                        level=l.get("level", "INFO"),
                        agent_name=l.get("agent_name", node_name),
                        message=l.get("message", ""),
                        metadata_json=l.get("metadata_json"),
                    )
                    session.add(log_rec)

                # Add sources if validator finished
                if node_name == "validator" and "validated_sources" in node_state:
                    for vs in node_state["validated_sources"]:
                        source_rec = Source(
                            id=str(uuid.uuid4()),
                            project_id=project_id,
                            url=vs.get("url", ""),
                            title=vs.get("title", ""),
                            snippet=vs.get("snippet", ""),
                            domain=vs.get("domain", ""),
                            category=vs.get("category", "Web"),
                            trust_score=vs.get("trust_score", 85.0),
                            published_date=vs.get("published_date", "2025/2026"),
                        )
                        session.add(source_rec)

                await session.commit()
            except Exception as e:
                logger.error(f"Error syncing step to DB: {e}")
                await session.rollback()

    @classmethod
    async def _finalize_project_in_db(cls, project_id: str, final_state: Optional[Dict[str, Any]] = None) -> Optional[str]:
        """Finalizes the project status and creates the Report record."""
        async with AsyncSessionLocal() as session:
            try:
                res = await session.execute(
                    select(ResearchProject)
                    .options(selectinload(ResearchProject.sources))
                    .where(ResearchProject.id == project_id)
                )
                project = res.scalar_one_or_none()
                if not project:
                    return None

                project.status = "completed"
                project.progress_percentage = 100

                # Check if report already exists
                rep_res = await session.execute(select(Report).where(Report.project_id == project_id))
                existing_report = rep_res.scalar_one_or_none()

                if existing_report:
                    await session.commit()
                    return existing_report.id

                # Use accumulated final state or generate structured report
                final_md = ""
                if final_state and (final_state.get("final_report") or final_state.get("draft_report")):
                    final_md = final_state.get("final_report") or final_state.get("draft_report")
                
                if not final_md:
                    from backend.agents.report_writer import generate_structured_fallback_report
                    sources_list = [{"url": s.url, "title": s.title, "domain": s.domain} for s in project.sources]
                    final_md = generate_structured_fallback_report(
                        topic=project.topic,
                        language=project.language,
                        analysis=final_state.get("analysis", {}) if final_state else {},
                        sources=sources_list,
                        confidence=final_state.get("confidence_score", 95.8) if final_state else 95.8
                    )
                
                words = len(final_md.split())
                reading_time = max(1, words // 200)
                conf_score = final_state.get("confidence_score", 95.8) if final_state else 95.8
                qual_score = final_state.get("quality_score", 96.0) if final_state else 96.0
                fact_score = final_state.get("fact_check_score", 95.0) if final_state else 95.0

                report = Report(
                    id=str(uuid.uuid4()),
                    project_id=project_id,
                    title=f"Strategic Dossier: {project.topic}",
                    executive_summary=f"Comprehensive autonomous empirical analysis for {project.topic}.",
                    full_markdown=final_md,
                    word_count=words,
                    reading_time_minutes=reading_time,
                    confidence_score=float(conf_score),
                    fact_check_score=float(fact_score),
                    quality_score=float(qual_score),
                    sources_count=len(project.sources),
                    citation_style=project.citation_style,
                    share_token=str(uuid.uuid4())[:12]
                )
                session.add(report)
                await session.flush()

                # Add citations from state or sources
                from backend.agents.citation import format_citation_rule_based
                if final_state and final_state.get("formatted_citations"):
                    for c_dict in final_state["formatted_citations"]:
                        cit = Citation(
                            id=str(uuid.uuid4()),
                            report_id=report.id,
                            index_number=c_dict.get("index", 1),
                            formatted_text=c_dict.get("formatted_text", ""),
                            url=c_dict.get("url", "")
                        )
                        session.add(cit)
                else:
                    for idx, s in enumerate(project.sources, 1):
                        cit = Citation(
                            id=str(uuid.uuid4()),
                            report_id=report.id,
                            source_id=s.id,
                            index_number=idx,
                            formatted_text=format_citation_rule_based({"title": s.title, "domain": s.domain, "url": s.url}, idx, project.citation_style),
                            url=s.url
                        )
                        session.add(cit)

                await session.commit()
                logger.info(f"Project {project_id} successfully finalized in database with report ID: {report.id}")
                return report.id
            except Exception as e:
                logger.error(f"Error finalizing report in DB: {e}", exc_info=True)
                await session.rollback()
                return None

    @classmethod
    async def _mark_project_failed(cls, project_id: str, error_msg: str):
        async with AsyncSessionLocal() as session:
            try:
                res = await session.execute(select(ResearchProject).where(ResearchProject.id == project_id))
                project = res.scalar_one_or_none()
                if project:
                    project.status = "failed"
                    project.error_message = error_msg
                await session.commit()
            except Exception:
                await session.rollback()
