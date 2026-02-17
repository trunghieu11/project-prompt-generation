#!/bin/bash

# Get the directory where the script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Kill process running on port 8000
echo "Checking for existing backend process..."
PID=$(lsof -ti:8000)
if [ ! -z "$PID" ]; then
    echo "Stopping process $PID..."
    kill -9 $PID
    echo "Stopped."
else
    echo "No existing backend process found."
fi

# Go to the backend directory
cd "$DIR"

# Activate venv if it exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
else
    echo "Error: Virtual environment not found in $DIR/venv"
    exit 1
fi

# Start server
echo "Starting backend server..."
uvicorn main:app --reload --port 8000
