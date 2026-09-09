from datetime import datetime
from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, EmailStr, Field


# --- Auth Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "user"


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# --- Research Project Schemas ---
class ResearchOptions(BaseModel):
    depth: str = Field(default="standard", description="quick, standard, deep, comprehensive")
    language: str = Field(default="English", description="Language of report")
    citation_style: str = Field(default="APA", description="APA, MLA, Chicago, IEEE, Markdown")
    model_provider: str = Field(default="simulation", description="claude, openai, gemini, simulation")
    model_name: Optional[str] = None
    focus_areas: List[str] = Field(default_factory=list, description="Specific focus areas or questions")
    include_uploaded_files: bool = True
    uploaded_file_ids: List[str] = Field(default_factory=list)
    temperature: float = 0.2
    max_tokens: int = 4096


class ResearchStartRequest(BaseModel):
    topic: str = Field(..., min_length=3, description="Main research topic or inquiry")
    options: Optional[ResearchOptions] = Field(default_factory=ResearchOptions)


class HumanApprovalRequest(BaseModel):
    action: str = Field(..., description="'approve', 'reject', or 'rewrite'")
    feedback: Optional[str] = Field(default=None, description="Optional feedback instructions for rewrite")


# --- Source & Citation Schemas ---
class SourceItem(BaseModel):
    id: Optional[str] = None
    url: str
    title: str
    snippet: Optional[str] = None
    domain: str
    category: str = "Unknown"
    trust_score: float = 85.0
    published_date: Optional[str] = None

    class Config:
        from_attributes = True


class CitationItem(BaseModel):
    id: Optional[str] = None
    index_number: int
    formatted_text: str
    url: str

    class Config:
        from_attributes = True


# --- Report Schemas ---
class ReportResponse(BaseModel):
    id: str
    project_id: str
    title: str
    executive_summary: str
    full_markdown: str
    word_count: int
    reading_time_minutes: int
    confidence_score: float
    fact_check_score: float
    quality_score: float
    sources_count: int
    citation_style: str
    is_public: bool
    share_token: Optional[str] = None
    created_at: datetime
    citations: List[CitationItem] = []

    class Config:
        from_attributes = True


# --- Agent Execution & Log Schemas ---
class AgentExecutionItem(BaseModel):
    id: str
    agent_name: str
    step_number: int
    status: str
    latency_ms: int
    tokens_used: int
    cost_estimate_usd: float
    thought_log: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class SystemLogItem(BaseModel):
    id: str
    level: str
    agent_name: Optional[str] = None
    message: str
    metadata_json: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- Research Project Details Response ---
class ResearchProjectResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    title: str
    topic: str
    status: str
    depth: str
    language: str
    citation_style: str
    model_provider: str
    model_name: str
    focus_areas: List[str] = []
    current_agent: Optional[str] = None
    progress_percentage: int = 0
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    report: Optional[ReportResponse] = None
    agent_executions: List[AgentExecutionItem] = []
    sources: List[SourceItem] = []
    logs: List[SystemLogItem] = []

    class Config:
        from_attributes = True


# --- Analytics & Stats Schemas ---
class UserAnalyticsResponse(BaseModel):
    total_projects: int
    completed_reports: int
    total_agents_executed: int
    total_tokens_processed: int
    estimated_cost_saved_usd: float
    average_completion_time_seconds: float
    top_topics: List[Dict[str, Any]]
    weekly_activity: List[Dict[str, Any]]
    agent_latency_breakdown: List[Dict[str, Any]]


# --- Admin & Health Schemas ---
class SystemHealthResponse(BaseModel):
    status: str
    version: str
    database_connected: bool
    redis_connected: bool
    active_workers: int
    llm_providers_configured: Dict[str, bool]
    search_provider_active: str
