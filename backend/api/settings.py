import os
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter

from backend.core.config import settings

router = APIRouter(prefix="/settings", tags=["Model & System Settings"])


class SettingsUpdate(BaseModel):
    default_provider: str = Field(default="simulation")
    model_name: Optional[str] = None
    temperature: float = Field(default=0.2, ge=0.0, le=1.0)
    max_tokens: int = Field(default=4096, ge=512, le=8192)
    citation_style: str = Field(default="APA")
    tavily_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None


_runtime_settings = {
    "default_provider": settings.DEFAULT_LLM_PROVIDER,
    "model_name": settings.DEFAULT_MODEL_NAME,
    "temperature": settings.DEFAULT_TEMPERATURE,
    "max_tokens": settings.DEFAULT_MAX_TOKENS,
    "citation_style": "APA",
    "theme": "dark",
}


@router.get("")
async def get_settings():
    """Retrieve active system and LLM settings."""
    return {
        **_runtime_settings,
        "available_providers": [
            {"id": "simulation", "name": "Zero-Config Simulation Engine (Instant, Offline)", "icon": "cpu"},
            {"id": "claude", "name": "Anthropic Claude (3.5 Sonnet / Haiku)", "icon": "sparkles"},
            {"id": "openai", "name": "OpenAI (GPT-4o / GPT-4o-mini)", "icon": "bot"},
            {"id": "gemini", "name": "Google Gemini (2.0 Flash / 1.5 Pro)", "icon": "zap"},
            {"id": "deepseek", "name": "DeepSeek (DeepSeek-V3 / R1)", "icon": "brain"},
        ],
        "available_citation_styles": ["APA", "MLA", "Chicago", "IEEE", "Markdown Links"],
        "has_anthropic_key": bool(settings.ANTHROPIC_API_KEY or os.getenv("ANTHROPIC_API_KEY")),
        "has_openai_key": bool(settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")),
        "has_gemini_key": bool(settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")),
        "has_tavily_key": bool(settings.TAVILY_API_KEY or os.getenv("TAVILY_API_KEY")),
    }


@router.post("")
async def update_settings(payload: SettingsUpdate):
    """Update active model parameters and API keys."""
    _runtime_settings["default_provider"] = payload.default_provider
    if payload.model_name:
        _runtime_settings["model_name"] = payload.model_name
    _runtime_settings["temperature"] = payload.temperature
    _runtime_settings["max_tokens"] = payload.max_tokens
    _runtime_settings["citation_style"] = payload.citation_style

    if payload.anthropic_api_key:
        os.environ["ANTHROPIC_API_KEY"] = payload.anthropic_api_key
    if payload.openai_api_key:
        os.environ["OPENAI_API_KEY"] = payload.openai_api_key
    if payload.gemini_api_key:
        os.environ["GEMINI_API_KEY"] = payload.gemini_api_key
    if payload.tavily_api_key:
        os.environ["TAVILY_API_KEY"] = payload.tavily_api_key

    return {"status": "success", "message": "Settings updated successfully", "settings": _runtime_settings}
