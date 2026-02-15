#!/bin/bash

# Start Backend
echo "Starting Backend..."
cd backend && npm run dev &

# Start Evidence Service
echo "Starting Evidence Service..."
cd evidence-service && node index.js &

# Start AI Service
echo "Starting AI Service..."
cd ai-service && . venv/bin/activate && python app.py &

# Start Frontend
echo "Starting Frontend..."
cd frontend && npm run dev &

echo "All services started!"
wait
