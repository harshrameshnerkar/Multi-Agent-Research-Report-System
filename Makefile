.PHONY: install dev-backend dev-frontend test docker-up docker-down clean

install:
	pip install -r backend/requirements.txt
	cd frontend && npm install

dev-backend:
	uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	cd frontend && npm run dev

test:
	pytest backend/tests -v --cov=backend

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf backend/exports/*
	rm -rf backend/uploads/*
