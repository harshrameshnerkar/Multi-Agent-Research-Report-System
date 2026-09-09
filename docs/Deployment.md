# Production Deployment Guide

## 1. Local Docker Compose Stack

The full production-ready multi-container stack can be launched with a single command:

```bash
docker compose up --build -d
```

### Services Deployed:
* **Frontend**: React 19 Client on `http://localhost:3000`
* **Backend**: FastAPI Gateway on `http://localhost:8000`
* **PostgreSQL**: Relational DB on `localhost:5432`
* **Redis**: Cache & Celery message broker on `localhost:6379`
* **Celery Worker**: Distributed 4-thread agent task runner
* **Nginx**: Reverse proxy on `http://localhost:80` with unbuffered SSE proxying

---

## 2. Cloud Deployment: Render

This repository includes a native `render.yaml` blueprint:

1. Connect your GitHub repository to Render.
2. Select **New Blueprints Instance**.
3. Render automatically provisions:
   * `nexus-research-backend` (FastAPI Web Service)
   * `nexus-celery-worker` (Background Worker)
   * `nexus-postgres` (Managed PostgreSQL 16)
   * `nexus-redis` (Managed Redis Cache)

---

## 3. Cloud Deployment: Vercel (Frontend)

1. Import the repository into Vercel.
2. Set root directory to `frontend` or use root `vercel.json`.
3. Add environment variable:
   ```env
   VITE_API_URL=https://your-backend-api.onrender.com
   ```
4. Deploy!
