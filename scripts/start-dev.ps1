# PowerShell Startup Script for Multi-Agent Research Platform
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Launching NexusResearch Multi-Agent System (Dev Mode)   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start Backend in Background or Separate Job
Write-Host "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn backend.main:app --reload --port 8000"

# 2. Start Frontend
Write-Host "[2/2] Starting React 19 Frontend on http://localhost:5173..." -ForegroundColor Green
cd frontend
npm run dev
