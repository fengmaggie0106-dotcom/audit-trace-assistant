$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $root "backend"
$backendPython = Join-Path $backendDir ".venv\Scripts\python.exe"

if (-not (Test-Path $backendPython)) {
    throw "Backend virtual environment not found: $backendPython"
}

Push-Location $backendDir
try {
    & $backendPython .\seed.py
}
finally {
    Pop-Location
}
