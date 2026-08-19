$ErrorActionPreference = "Stop"
Write-Host "Checking Ananta Industries Management System..." -ForegroundColor Cyan
npm run verify
if ($LASTEXITCODE -ne 0) { throw "Verification failed." }
Write-Host "Verification passed." -ForegroundColor Green
