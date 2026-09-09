import pytest
from backend.graph.builder import create_research_graph
from backend.graph.state import ResearchState


@pytest.mark.asyncio
async def test_full_graph_execution():
    graph = create_research_graph()
    initial_state: ResearchState = {
        "project_id": "test-graph-123",
        "topic": "Autonomous AI Agents vs RAG",
        "depth": "quick",
        "language": "English",
        "citation_style": "APA",
        "model_provider": "simulation",
        "focus_areas": [],
        "uploaded_file_ids": [],
        "current_step": "Init",
        "progress_percentage": 0,
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
        "human_action": "approve",
        "human_feedback": None,
        "rewrite_count": 0,
        "final_report": None,
        "executive_summary": None,
        "logs": [],
        "agent_executions": [],
    }

    config = {"configurable": {"thread_id": "test-thread-1"}}
    final_output = await graph.ainvoke(initial_state, config=config)

    assert final_output["status"] == "completed"
    assert len(final_output["subtasks"]) >= 4
    assert len(final_output["sources"]) > 0
    assert len(final_output["validated_sources"]) > 0
    assert "draft_report" in final_output
    assert len(final_output["draft_report"]) > 500
    assert final_output["progress_percentage"] == 100
