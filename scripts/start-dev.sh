#!/bin/bash
# Bash Startup Script for Multi-Agent Research Platform
echo "=========================================================="
echo "  Launching NexusResearch Multi-Agent System (Dev Mode)   "
echo "=========================================================="

# Start backend in background
echo "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000..."
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Start frontend
echo "[2/2] Starting React 19 Frontend on http://localhost:5173..."
cd frontend && npm run dev

# Trap exit to kill backend
trap "kill $BACKEND_PID" EXIT
