import os
from celery import Celery
from backend.core.config import settings

redis_url = settings.REDIS_URL or os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "research_system_workers",
    broker=settings.CELERY_BROKER_URL or redis_url,
    backend=settings.CELERY_RESULT_BACKEND or redis_url,
    include=["backend.workers.tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=600,  # 10 minutes max per task
)
