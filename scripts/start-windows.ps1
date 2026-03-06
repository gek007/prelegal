# PreLegal Start Script for Windows
Write-Host "Starting PreLegal..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
}

# Build and start containers
Write-Host "Building Docker image..." -ForegroundColor Yellow
docker-compose build

Write-Host "Starting containers..." -ForegroundColor Yellow
docker-compose up -d

# Wait for backend to be ready
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
$backendReady = $false
$maxAttempts = 30
$attempt = 0

while (-not $backendReady -and $attempt -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $backendReady = $true
        }
    } catch {
        $attempt++
        Start-Sleep -Seconds 2
    }
}

if ($backendReady) {
    Write-Host "✓ PreLegal is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frontend: http://localhost:8000" -ForegroundColor Cyan
    Write-Host "Backend API: http://localhost:8000/api" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Ctrl+C to stop viewing logs" -ForegroundColor Yellow
    Write-Host "To stop the application, run: .\scripts\stop-windows.ps1" -ForegroundColor Yellow
    Write-Host ""

    # Show logs
    docker-compose logs -f
} else {
    Write-Error "Backend failed to start. Check logs with: docker-compose logs"
    exit 1
}
