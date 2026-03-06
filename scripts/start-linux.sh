#!/bin/bash
# PreLegal Start Script for Linux/macOS

echo "Starting PreLegal..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✓ Docker is running"

# Build and start containers
echo "Building Docker image..."
docker-compose build

echo "Starting containers..."
docker-compose up -d

# Wait for backend to be ready
echo "Waiting for backend to start..."
backend_ready=false
max_attempts=30
attempt=0

while [ "$backend_ready" = false ] && [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
        backend_ready=true
    else
        attempt=$((attempt + 1))
        sleep 2
    fi
done

if [ "$backend_ready" = true ]; then
    echo "✓ PreLegal is ready!"
    echo ""
    echo "Frontend: http://localhost:8000"
    echo "Backend API: http://localhost:8000/api"
    echo ""
    echo "Press Ctrl+C to stop viewing logs"
    echo "To stop the application, run: ./scripts/stop-linux.sh"
    echo ""

    # Show logs
    docker-compose logs -f
else
    echo "Error: Backend failed to start. Check logs with: docker-compose logs"
    exit 1
fi
