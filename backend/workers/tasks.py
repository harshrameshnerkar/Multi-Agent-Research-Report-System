import asyncio
from typing import Dict, Any
from loguru import logger
from backend.workers.celery_app import celery_app
from backend.services.research_service import ResearchService


@celery_app.task(name="tasks.execute_multi_agent_research")
def execute_multi_agent_research(project_id: str, topic: str, options: Dict[str, Any]):
    """
    Celery background task for asynchronous execution of LangGraph research state machine.
    """
    logger.info(f"[Celery Worker] Processing research job {project_id} for topic: {topic}")
    
    # Run async workflow within worker event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(
            ResearchService.run_workflow(
                project_id=project_id,
                topic=topic,
                options=options
            )
        )
    finally:
        loop.close()
    
    return {"status": "success", "project_id": project_id}
