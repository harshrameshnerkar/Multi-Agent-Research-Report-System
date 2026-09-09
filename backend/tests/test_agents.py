import pytest
from backend.agents.orchestrator import orchestrator_node
from backend.agents.researcher import researcher_node
from backend.agents.validator import source_validator_node
from backend.agents.analyzer import analyzer_node
from backend.agents.fact_checker import fact_checker_node
from backend.agents.report_writer import report_writer_node
from backend.agents.citation import citation_node
from backend.agents.reviewer import reviewer_node
from backend.agents.human_approval import human_approval_node


@pytest.mark.asyncio
async def test_orchestrator_node():
    state = {
        "project_id": "test-p1",
        "topic": "India's Semiconductor Industry",
        "depth": "standard",
        "model_provider": "simulation",
    }
    res = await orchestrator_node(state)
    assert "subtasks" in res
    assert len(res["subtasks"]) >= 4
    assert res["progress_percentage"] > 0
    assert len(res["logs"]) > 0


@pytest.mark.asyncio
async def test_researcher_node():
    state = {
        "project_id": "test-p1",
        "topic": "Autonomous AI Agents",
        "subtasks": [
            {"id": "subtask-1", "title": "Architecture Overview", "search_queries": ["Autonomous AI agents architecture"]}
        ],
        "uploaded_file_ids": [],
    }
    res = await researcher_node(state)
    assert "evidence" in res
    assert "sources" in res
    assert len(res["evidence"]) > 0
    assert len(res["sources"]) > 0


@pytest.mark.asyncio
async def test_validator_node():
    state = {
        "sources": [
            {"url": "https://nature.com/articles/s1", "title": "Nature Agent Paper", "domain": "nature.com"},
            {"url": "https://gov.in/policy/semicon", "title": "Gov Policy", "domain": "gov.in"},
        ],
        "model_provider": "simulation",
    }
    res = await source_validator_node(state)
    assert "validated_sources" in res
    assert len(res["validated_sources"]) == 2
    assert res["validated_sources"][0]["category"] == "Academic"
    assert res["validated_sources"][1]["category"] == "Government"


@pytest.mark.asyncio
async def test_analyzer_node():
    state = {
        "topic": "Quantum Computing",
        "evidence": [{"title": "Quantum benchmarks", "content": "Demonstrated 4x speedup"}],
        "model_provider": "simulation",
    }
    res = await analyzer_node(state)
    assert "analysis" in res
    assert "key_findings" in res["analysis"]
    assert "statistics" in res["analysis"]


@pytest.mark.asyncio
async def test_fact_checker_node():
    state = {
        "topic": "Quantum Computing",
        "analysis": {"key_findings": ["Quantum speedup demonstrated"]},
        "validated_sources": [{"domain": "nature.com"}],
        "model_provider": "simulation",
    }
    res = await fact_checker_node(state)
    assert "fact_checks" in res
    assert "confidence_score" in res
    assert res["confidence_score"] >= 90.0


@pytest.mark.asyncio
async def test_report_writer_node():
    state = {
        "topic": "AI in Healthcare",
        "language": "English",
        "analysis": {"key_findings": ["Diagnostics efficiency increased"]},
        "validated_sources": [{"domain": "nature.com"}],
        "confidence_score": 96.0,
        "model_provider": "simulation",
    }
    res = await report_writer_node(state)
    assert "draft_report" in res
    assert len(res["draft_report"]) > 300
    assert "Executive Summary" in res["draft_report"]


@pytest.mark.asyncio
async def test_citation_node():
    state = {
        "validated_sources": [{"title": "Paper 1", "domain": "ieee.org", "url": "https://ieee.org/p1"}],
        "citation_style": "APA",
    }
    res = await citation_node(state)
    assert "formatted_citations" in res
    assert len(res["formatted_citations"]) == 1
    assert "ieee.org" in res["formatted_citations"][0]["formatted_text"].lower()


@pytest.mark.asyncio
async def test_reviewer_node():
    state = {
        "topic": "AI in Healthcare",
        "draft_report": "# Test Report\n## 1. Intro\nContent",
        "model_provider": "simulation",
    }
    res = await reviewer_node(state)
    assert "quality_score" in res
    assert res["quality_score"] >= 90.0
    assert res["human_approval_required"] is True


@pytest.mark.asyncio
async def test_human_approval_node():
    state = {
        "draft_report": "# Finalized Report Content",
        "human_action": "approve",
    }
    res = await human_approval_node(state)
    assert res["status"] == "completed"
    assert res["final_report"] == "# Finalized Report Content"
