import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_demo_login(client: AsyncClient):
    response = await client.post("/api/auth/demo-login")
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "user" in data


@pytest.mark.asyncio
async def test_research_start_and_get(client: AsyncClient):
    # 1. Start research
    payload = {
        "topic": "Quantum Computing Scalability",
        "options": {
            "depth": "standard",
            "language": "English",
            "citation_style": "APA",
            "model_provider": "simulation"
        }
    }
    response = await client.post("/api/research/start", json=payload)
    assert response.status_code == 200
    project = response.json()
    assert project["topic"] == "Quantum Computing Scalability"
    assert project["status"] == "running"
    project_id = project["id"]

    # 2. Get project details
    get_res = await client.get(f"/api/research/{project_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == project_id


@pytest.mark.asyncio
async def test_graph_definition_endpoint(client: AsyncClient):
    response = await client.get("/api/research/graph/definition")
    assert response.status_code == 200
    assert "mermaid" in response.json()
    assert "Orchestrator Agent" in response.json()["mermaid"]


@pytest.mark.asyncio
async def test_analytics_endpoint(client: AsyncClient):
    response = await client.get("/api/analytics")
    assert response.status_code == 200
    data = response.json()
    assert "total_projects" in data
    assert "agent_latency_breakdown" in data


@pytest.mark.asyncio
async def test_settings_endpoint(client: AsyncClient):
    response = await client.get("/api/settings")
    assert response.status_code == 200
    data = response.json()
    assert "available_providers" in data
    assert "available_citation_styles" in data
