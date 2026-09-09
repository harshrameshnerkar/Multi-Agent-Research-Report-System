import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import asyncio
import uuid
from datetime import datetime, timezone
from sqlalchemy import select

from backend.db.database import AsyncSessionLocal, init_db
from backend.models.models import User, ResearchProject, Report, Source, Citation, AgentExecution, SystemLog
from backend.core.security import get_password_hash
from backend.agents.report_writer import generate_structured_fallback_report


async def seed_database():
    print("[*] Initializing and seeding database with portfolio demonstration data...")
    await init_db()

    async with AsyncSessionLocal() as session:
        # Check if already seeded
        res = await session.execute(select(User).where(User.email == "demo.researcher@antigravity.ai"))
        if res.scalar_one_or_none():
            print("Database already contains demo data.")
            return

        # 1. Create Demo User
        user = User(
            id=str(uuid.uuid4()),
            email="demo.researcher@antigravity.ai",
            hashed_password=get_password_hash("DemoPass123!"),
            full_name="Lead AI Architect",
            role="admin"
        )
        session.add(user)
        await session.flush()

        sample_projects = [
            {
                "topic": "India's Semiconductor Industry & FAB Ecosystem",
                "depth": "deep",
                "citations": 6,
                "confidence": 96.4
            },
            {
                "topic": "Autonomous AI Agents vs RAG Architectures",
                "depth": "standard",
                "citations": 5,
                "confidence": 97.2
            },
            {
                "topic": "Artificial Intelligence in Healthcare Diagnostics",
                "depth": "comprehensive",
                "citations": 6,
                "confidence": 95.8
            }
        ]

        for p_data in sample_projects:
            proj_id = str(uuid.uuid4())
            topic = p_data["topic"]
            
            project = ResearchProject(
                id=proj_id,
                user_id=user.id,
                title=f"Strategic Dossier: {topic}",
                topic=topic,
                status="completed",
                depth=p_data["depth"],
                language="English",
                citation_style="APA",
                model_provider="claude",
                model_name="claude-3-5-sonnet",
                progress_percentage=100,
                current_agent="Human Approval Node"
            )
            session.add(project)
            await session.flush()

            # Add sources
            sources_created = []
            for i in range(p_data["citations"]):
                s = Source(
                    id=str(uuid.uuid4()),
                    project_id=proj_id,
                    url=f"https://www.nature.com/articles/{topic.lower().replace(' ', '-')[:25]}-{i+1}",
                    title=f"Peer-Reviewed Empirical Study on {topic} Part {i+1}",
                    snippet=f"In-depth investigation of technical scalability, cost curves, and empirical validation in {topic}.",
                    domain="nature.com",
                    category="Academic" if i % 2 == 0 else "Official Company",
                    trust_score=96.5,
                    published_date="2025-10-18"
                )
                session.add(s)
                sources_created.append(s)
            
            await session.flush()

            # Add full report
            full_md = generate_structured_fallback_report(
                topic=topic,
                language="English",
                analysis={},
                sources=[{"title": s.title, "domain": s.domain, "url": s.url} for s in sources_created],
                confidence=p_data["confidence"]
            )

            report = Report(
                id=str(uuid.uuid4()),
                project_id=proj_id,
                title=f"Strategic Dossier: {topic}",
                executive_summary=f"High-authority multi-agent empirical analysis for {topic}.",
                full_markdown=full_md,
                word_count=len(full_md.split()),
                reading_time_minutes=max(1, len(full_md.split()) // 200),
                confidence_score=p_data["confidence"],
                fact_check_score=95.5,
                quality_score=96.5,
                sources_count=len(sources_created),
                citation_style="APA",
                is_public=True,
                share_token=str(uuid.uuid4())[:12]
            )
            session.add(report)
            await session.flush()

            # Add citations
            for idx, s in enumerate(sources_created, 1):
                cit = Citation(
                    id=str(uuid.uuid4()),
                    report_id=report.id,
                    source_id=s.id,
                    index_number=idx,
                    formatted_text=f"Nature Intelligence. (2025). *{s.title}*. Retrieved from {s.url}",
                    url=s.url
                )
                session.add(cit)

        await session.commit()
        print("[SUCCESS] Database seeding complete! Demo user and 3 strategic reports are ready.")


if __name__ == "__main__":
    asyncio.run(seed_database())
