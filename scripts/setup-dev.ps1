$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "[1/3] Installing frontend dependencies..."
npm install

Write-Host "[2/3] Installing API dependencies..."
npm --prefix barbieri_api install

Write-Host "[3/3] Starting frontend and API together..."
npm run dev:all
