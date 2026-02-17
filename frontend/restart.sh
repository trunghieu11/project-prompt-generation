#!/bin/bash

# Define the port
PORT=3000

echo "Checking for existing frontend process on port $PORT..."

# Find the process ID (PID) using lsof
PID=$(lsof -t -i:$PORT)

if [ -n "$PID" ]; then
  echo "Stopping process $PID..."
  kill -9 $PID
  echo "Stopped."
else
  echo "No process found on port $PORT."
fi

# Also try to find any "next-server" or "next dev" processes more aggressively if lsof missed them
# purely based on the command name, to ensure a clean slate.
echo "Cleaning up any stray Next.js processes..."
pkill -f "next-server" || true
pkill -f "next dev" || true

echo "Starting frontend..."
npm run dev
