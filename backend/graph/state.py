import operator
from typing import TypedDict, Annotated, List, Dict, Any, Optional


def merge_dicts(a: Dict[str, Any], b: Dict[str, Any]) -> Dict[str, Any]:
    """Reducer for merging dictionary states."""
    res = dict(a)
    res.update(b)
    return res


class ResearchState(TypedDict):
    """
    Shared state schema for the Multi-Agent Research StateGraph.
    Annotated reducers allow concurrent agents to write to evidence and logs simultaneously.
    """
    # Core topic and options
    project_id: str
    topic: str
    depth: str
    language: str
    citation_style: str
    model_provider: str
    focus_areas: List[str]
    uploaded_file_ids: List[str]
    
    # Progress and status
    current_step: str
    progress_percentage: int
    status: str  # 'running', 'human_approval', 'completed', 'failed', 'rewriting'
    
    # Orchestrator plan
    subtasks: List[Dict[str, Any]]
    research_plan_rationale: Optional[str]
    
    # Research Evidence & Sources (Parallel reducer)
    evidence: Annotated[List[Dict[str, Any]], operator.add]
    sources: Annotated[List[Dict[str, Any]], operator.add]
    
    # Validation & Analysis
    validated_sources: List[Dict[str, Any]]
    source_stats: Dict[str, Any]
    analysis: Dict[str, Any]
    
    # Fact Checking & Verification
    fact_checks: Dict[str, Any]
    confidence_score: float
    
    # Draft & Citations
    draft_report: str
    formatted_citations: List[Dict[str, Any]]
    
    # Review & Editorial Feedback
    review_notes: Dict[str, Any]
    quality_score: float
    
    # Human-in-the-loop State
    human_approval_required: bool
    human_action: Optional[str]  # 'approve', 'reject', 'rewrite'
    human_feedback: Optional[str]
    rewrite_count: int
    
    # Final Output
    final_report: Optional[str]
    executive_summary: Optional[str]
    
    # Logs and metrics (Accumulated)
    logs: Annotated[List[Dict[str, Any]], operator.add]
    agent_executions: Annotated[List[Dict[str, Any]], operator.add]
