$ErrorActionPreference = "Stop"
Write-Host "Ananta Industries - clean Windows build" -ForegroundColor Cyan
if (Test-Path ".\dist") { Remove-Item ".\dist" -Recurse -Force }
npm run verify
if ($LASTEXITCODE -ne 0) { throw "Verification failed; build stopped." }
npm run build:win
if ($LASTEXITCODE -ne 0) { throw "Windows build failed." }
Write-Host "Build complete. Opening dist folder..." -ForegroundColor Green
Start-Process explorer.exe ".\dist"
