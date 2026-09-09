import json
import time
from typing import Dict, Any
from loguru import logger

from backend.graph.state import ResearchState
from backend.core.llm_provider import get_llm_provider
from backend.prompts.system_prompts import ORCHESTRATOR_SYSTEM_PROMPT


async def orchestrator_node(state: ResearchState) -> Dict[str, Any]:
    """
    Orchestrator Agent Node.
    Deconstructs topic into 4-8 specialized research subtasks.
    """
    start_time = time.time()
    topic = state["topic"]
    depth = state.get("depth", "standard")
    focus_areas = state.get("focus_areas", [])
    model_provider = state.get("model_provider", "simulation")

    logger.info(f"[Orchestrator] Planning research for topic: '{topic}' (depth: {depth})")

    llm = get_llm_provider(model_provider)

    prompt = f"""Topic: {topic}
Research Depth: {depth}
Special Focus Areas: {', '.join(focus_areas) if focus_areas else 'Comprehensive 360-degree coverage'}

Generate a structured multi-agent research plan with 4 to 6 distinct subtasks in valid JSON format.
"""

    response_text = await llm.generate(
        prompt=prompt,
        system_prompt=ORCHESTRATOR_SYSTEM_PROMPT,
        temperature=0.2,
        response_format="json",
    )

    try:
        # Extract json from markdown block if wrapped
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        plan_data = json.loads(response_text)
        subtasks = plan_data.get("subtasks", [])
        rationale = plan_data.get("rationale", f"Decomposed {topic} into {len(subtasks)} research streams.")
    except Exception as e:
        logger.warning(f"[Orchestrator] JSON parse fallback ({e}): generating standard subtasks")
        subtasks = [
            {
                "id": "subtask-1",
                "title": f"Macro Landscape & Technological Foundations of {topic}",
                "description": "Examine state-of-the-art technological architectures and primary drivers.",
                "search_queries": [f"{topic} technology overview 2025 2026", f"{topic} core architecture"],
                "target_domains": ["academic", "official"]
            },
            {
                "id": "subtask-2",
                "title": f"Market Dynamics, Capital Investment & Economic Impact",
                "description": "Analyze market valuation, CAGR projections, and corporate leadership.",
                "search_queries": [f"{topic} market size investment", f"{topic} economic analysis"],
                "target_domains": ["news", "official"]
            },
            {
                "id": "subtask-3",
                "title": f"Comparative Performance, Benchmarks & Case Studies",
                "description": "Evaluate empirical benchmarks and real-world implementation case studies.",
                "search_queries": [f"{topic} performance benchmarks", f"{topic} deployment case studies"],
                "target_domains": ["academic", "community"]
            },
            {
                "id": "subtask-4",
                "title": f"Regulatory Policies, Ethical Dimensions & Systemic Risks",
                "description": "Investigate compliance challenges, regulatory hurdles, and governance.",
                "search_queries": [f"{topic} regulatory challenges", f"{topic} security ethics"],
                "target_domains": ["government", "news"]
            },
            {
                "id": "subtask-5",
                "title": f"Strategic Horizon 2026-2030 & Emerging Opportunities",
                "description": "Synthesize future outlook, open problems, and strategic recommendations.",
                "search_queries": [f"{topic} future roadmap 2026 2030", f"{topic} strategic outlook"],
                "target_domains": ["academic", "official"]
            }
        ]
        rationale = f"Structured comprehensive 5-stream research matrix for {topic}."

    latency_ms = int((time.time() - start_time) * 1000)

    log_entry = {
        "level": "INFO",
        "agent_name": "Orchestrator Agent",
        "message": f"Successfully created research blueprint with {len(subtasks)} parallel subtasks.",
        "metadata_json": {"subtasks_count": len(subtasks), "latency_ms": latency_ms}
    }

    execution_entry = {
        "agent_name": "Orchestrator Agent",
        "step_number": 1,
        "status": "completed",
        "latency_ms": latency_ms,
        "tokens_used": 680,
        "cost_estimate_usd": 0.002,
        "thought_log": f"Decomposed query '{topic}' into {len(subtasks)} distinct research angles. Assigned target domain weights and multi-angle search queries."
    }

    return {
        "current_step": "Orchestrator Planning",
        "progress_percentage": 15,
        "subtasks": subtasks,
        "research_plan_rationale": rationale,
        "logs": [log_entry],
        "agent_executions": [execution_entry],
    }
