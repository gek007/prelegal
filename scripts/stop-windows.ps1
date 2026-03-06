# PreLegal Stop Script for Windows
Write-Host "Stopping PreLegal..." -ForegroundColor Yellow

docker-compose down

Write-Host "✓ PreLegal stopped" -ForegroundColor Green
