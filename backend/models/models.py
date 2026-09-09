import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import (
    Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from backend.db.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="user")  # 'user', 'admin'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    # Relationships
    projects = relationship("ResearchProject", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("UploadedDocument", back_populates="user", cascade="all, delete-orphan")


class ResearchProject(Base):
    __tablename__ = "research_projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    title = Column(String(500), nullable=False)
    topic = Column(Text, nullable=False)
    status = Column(String(50), default="queued", index=True)  # queued, running, human_approval, completed, failed, cancelled
    depth = Column(String(50), default="standard")  # quick, standard, deep, comprehensive
    language = Column(String(50), default="English")
    citation_style = Column(String(50), default="APA")
    model_provider = Column(String(50), default="simulation")
    model_name = Column(String(100), default="claude-3-5-sonnet")
    focus_areas = Column(JSON, default=list)  # List of focus area strings
    current_agent = Column(String(100), nullable=True)
    progress_percentage = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    graph_state_snapshot = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    # Relationships
    user = relationship("User", back_populates="projects")
    report = relationship("Report", back_populates="project", uselist=False, cascade="all, delete-orphan")
    agent_executions = relationship("AgentExecution", back_populates="project", cascade="all, delete-orphan")
    sources = relationship("Source", back_populates="project", cascade="all, delete-orphan")
    logs = relationship("SystemLog", back_populates="project", cascade="all, delete-orphan")


class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("research_projects.id"), unique=True, nullable=False)
    title = Column(String(500), nullable=False)
    executive_summary = Column(Text, nullable=False)
    full_markdown = Column(Text, nullable=False)
    word_count = Column(Integer, default=0)
    reading_time_minutes = Column(Integer, default=0)
    confidence_score = Column(Float, default=95.0)
    fact_check_score = Column(Float, default=95.0)
    quality_score = Column(Float, default=95.0)
    sources_count = Column(Integer, default=0)
    citation_style = Column(String(50), default="APA")
    is_public = Column(Boolean, default=False)
    share_token = Column(String(100), unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    # Relationships
    project = relationship("ResearchProject", back_populates="report")
    citations = relationship("Citation", back_populates="report", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="report", cascade="all, delete-orphan")


class AgentExecution(Base):
    __tablename__ = "agent_executions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("research_projects.id"), nullable=False, index=True)
    agent_name = Column(String(100), nullable=False)
    step_number = Column(Integer, default=1)
    status = Column(String(50), default="running")  # idle, running, completed, failed, retrying, human_approval
    latency_ms = Column(Integer, default=0)
    tokens_used = Column(Integer, default=0)
    cost_estimate_usd = Column(Float, default=0.0)
    output_payload = Column(JSON, nullable=True)
    thought_log = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    # Relationships
    project = relationship("ResearchProject", back_populates="agent_executions")


class Source(Base):
    __tablename__ = "sources"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("research_projects.id"), nullable=False, index=True)
    url = Column(Text, nullable=False)
    title = Column(String(500), nullable=False)
    snippet = Column(Text, nullable=True)
    domain = Column(String(255), nullable=False)
    category = Column(String(100), default="Unknown")  # Government, Academic, News, Official Company, Community, Unknown
    trust_score = Column(Float, default=85.0)  # 0 to 100
    published_date = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)

    # Relationships
    project = relationship("ResearchProject", back_populates="sources")
    citations = relationship("Citation", back_populates="source")


class Citation(Base):
    __tablename__ = "citations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    report_id = Column(String(36), ForeignKey("reports.id"), nullable=False, index=True)
    source_id = Column(String(36), ForeignKey("sources.id"), nullable=True)
    index_number = Column(Integer, nullable=False)
    formatted_text = Column(Text, nullable=False)
    url = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)

    # Relationships
    report = relationship("Report", back_populates="citations")
    source = relationship("Source", back_populates="citations")


class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    report_id = Column(String(36), ForeignKey("reports.id"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    rating = Column(Integer, nullable=True)  # 1 to 5
    approval_status = Column(String(50), default="approved")  # approved, rejected, rewrite_requested
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)

    # Relationships
    report = relationship("Report", back_populates="feedbacks")


class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("research_projects.id"), nullable=True, index=True)
    level = Column(String(20), default="INFO")  # INFO, WARNING, ERROR, SUCCESS
    agent_name = Column(String(100), nullable=True)
    message = Column(Text, nullable=False)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)

    # Relationships
    project = relationship("ResearchProject", back_populates="logs")


class UploadedDocument(Base):
    __tablename__ = "uploaded_documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(Text, nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size_bytes = Column(Integer, default=0)
    chunk_count = Column(Integer, default=0)
    vector_collection_id = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)

    # Relationships
    user = relationship("User", back_populates="documents")
