from typing import Literal, Dict, Any
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

from backend.graph.state import ResearchState
from backend.agents.orchestrator import orchestrator_node
from backend.agents.researcher import researcher_node
from backend.agents.validator import source_validator_node
from backend.agents.analyzer import analyzer_node
from backend.agents.fact_checker import fact_checker_node
from backend.agents.report_writer import report_writer_node
from backend.agents.citation import citation_node
from backend.agents.reviewer import reviewer_node
from backend.agents.human_approval import human_approval_node


def route_after_approval(state: ResearchState) -> Literal["report_writer", "__end__"]:
    """Conditional routing edge after human approval node."""
    status = state.get("status")
    rewrite_count = state.get("rewrite_count", 0)

    # Route back to report writer if revision requested and under rewrite limit (max 3 rewrites)
    if status == "rewriting" and rewrite_count < 3:
        return "report_writer"
    return "__end__"


def create_research_graph(checkpointer: Any = None):
    """
    Constructs and compiles the full 9-agent LangGraph state machine.
    """
    workflow = StateGraph(ResearchState)

    # 1. Add all 9 agent nodes
    workflow.add_node("orchestrator", orchestrator_node)
    workflow.add_node("researcher", researcher_node)
    workflow.add_node("validator", source_validator_node)
    workflow.add_node("analyzer", analyzer_node)
    workflow.add_node("fact_checker", fact_checker_node)
    workflow.add_node("report_writer", report_writer_node)
    workflow.add_node("citation", citation_node)
    workflow.add_node("reviewer", reviewer_node)
    workflow.add_node("human_approval", human_approval_node)

    # 2. Add sequential and parallel routing edges
    workflow.add_edge(START, "orchestrator")
    workflow.add_edge("orchestrator", "researcher")
    workflow.add_edge("researcher", "validator")
    workflow.add_edge("validator", "analyzer")
    workflow.add_edge("analyzer", "fact_checker")
    workflow.add_edge("fact_checker", "report_writer")
    workflow.add_edge("report_writer", "citation")
    workflow.add_edge("citation", "reviewer")
    workflow.add_edge("reviewer", "human_approval")

    # 3. Add conditional edge for rewrite cycles & termination
    workflow.add_conditional_edges(
        "human_approval",
        route_after_approval,
        {
            "report_writer": "report_writer",
            "__end__": END
        }
    )

    # Use in-memory checkpointer if not provided
    memory = checkpointer if checkpointer is not None else MemorySaver()
    app = workflow.compile(checkpointer=memory)
    return app


def get_graph_mermaid_diagram() -> str:
    """Returns the visual Mermaid diagram definition representing the multi-agent graph."""
    return """graph TD
    START([🚀 Start]) --> Orchestrator["🎯 1. Orchestrator Agent"]
    Orchestrator --> Researcher["🔍 2. Research Agent (Parallel)"]
    Researcher --> Validator["🛡️ 3. Source Validator Agent"]
    Validator --> Analyzer["📊 4. Quantitative Analysis Agent"]
    Analyzer --> FactChecker["⚖️ 5. Adversarial Fact Checker"]
    FactChecker --> ReportWriter["✍️ 6. Report Writer Agent"]
    ReportWriter --> Citation["📚 7. Citation Standardization"]
    Citation --> Reviewer["🧐 8. Quality Reviewer Agent"]
    Reviewer --> HumanApproval{"👤 9. Human Approval Gate"}
    
    HumanApproval -->|Approve| END([🏁 Published Report])
    HumanApproval -->|Request Rewrite| ReportWriter
    HumanApproval -->|Reject| Abort([❌ Cancelled])
    
    classDef agent fill:#1e1e2e,stroke:#89b4fa,stroke-width:2px,color:#cdd6f4;
    classDef gate fill:#313244,stroke:#f9e2af,stroke-width:2px,color:#f9e2af;
    classDef terminal fill:#11111b,stroke:#a6e3a1,stroke-width:2px,color:#a6e3a1;
    
    class Orchestrator,Researcher,Validator,Analyzer,FactChecker,ReportWriter,Citation,Reviewer agent;
    class HumanApproval gate;
    class START,END terminal;
"""
