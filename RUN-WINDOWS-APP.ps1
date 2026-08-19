$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
Write-Host 'Installing dependencies (first run only)...' -ForegroundColor Cyan
npm install
Write-Host 'Starting Ananta Industries Windows App...' -ForegroundColor Green
npm run desktop
