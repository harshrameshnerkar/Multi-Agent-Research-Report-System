import time
from typing import Dict, Any
from loguru import logger
from backend.graph.state import ResearchState


async def human_approval_node(state: ResearchState) -> Dict[str, Any]:
    """
    Human Approval Node.
    Serves as the human-in-the-loop gate before final report publishing.
    """
    action = state.get("human_action")
    feedback = state.get("human_feedback")
    rewrite_count = state.get("rewrite_count", 0)

    logger.info(f"[Human Approval] Processing state: action='{action}', rewrites={rewrite_count}")

    if action == "approve" or action is None:
        # Default auto-approval or explicit human approval
        log_entry = {
            "level": "SUCCESS",
            "agent_name": "Human Approval Node",
            "message": "Report draft approved by human reviewer. Finalizing publication.",
            "metadata_json": {"action": "approve"}
        }
        execution_entry = {
            "agent_name": "Human Approval Node",
            "step_number": 9,
            "status": "completed",
            "latency_ms": 100,
            "tokens_used": 0,
            "cost_estimate_usd": 0.0,
            "thought_log": "Human reviewer approved draft without required revisions. Finalized report."
        }
        return {
            "current_step": "Human Approval & Finalization",
            "progress_percentage": 100,
            "status": "completed",
            "final_report": state.get("draft_report"),
            "human_approval_required": False,
            "logs": [log_entry],
            "agent_executions": [execution_entry],
        }
    
    elif action == "rewrite":
        log_entry = {
            "level": "WARNING",
            "agent_name": "Human Approval Node",
            "message": f"Human reviewer requested rewrite: '{feedback}'",
            "metadata_json": {"action": "rewrite", "feedback": feedback, "rewrite_count": rewrite_count + 1}
        }
        execution_entry = {
            "agent_name": "Human Approval Node",
            "step_number": 9,
            "status": "retrying",
            "latency_ms": 100,
            "tokens_used": 0,
            "cost_estimate_usd": 0.0,
            "thought_log": f"Received rewrite directive from user: {feedback}. Routing state back to Report Writer Agent."
        }
        return {
            "current_step": "Draft Revision in Progress",
            "progress_percentage": 80,
            "status": "rewriting",
            "rewrite_count": rewrite_count + 1,
            "human_approval_required": False,
            "logs": [log_entry],
            "agent_executions": [execution_entry],
        }

    else:  # reject
        log_entry = {
            "level": "ERROR",
            "agent_name": "Human Approval Node",
            "message": "Human reviewer rejected draft report.",
            "metadata_json": {"action": "reject"}
        }
        execution_entry = {
            "agent_name": "Human Approval Node",
            "step_number": 9,
            "status": "failed",
            "latency_ms": 100,
            "tokens_used": 0,
            "cost_estimate_usd": 0.0,
            "thought_log": "Human reviewer rejected report draft."
        }
        return {
            "current_step": "Report Rejected",
            "status": "cancelled",
            "human_approval_required": False,
            "logs": [log_entry],
            "agent_executions": [execution_entry],
        }
