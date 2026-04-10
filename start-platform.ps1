$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $root "backend"
$frontendDir = Join-Path $root "frontend"

$backendPidFile = Join-Path $backendDir ".backend_pid"
$frontendPidFile = Join-Path $frontendDir ".frontend_pid"
$deliverablesPidFile = Join-Path $root ".deliverables_server_pid"
$backendStdoutLog = Join-Path $backendDir ".backend.stdout.log"
$backendStderrLog = Join-Path $backendDir ".backend.stderr.log"

$backendUrl = "http://127.0.0.1:8000/health"
$frontendUrl = "http://127.0.0.1:3000"
$deliverablesUrl = "http://127.0.0.1:8092/deliverables/static-html-demo/index.html"

$backendPython = Join-Path $backendDir ".venv\Scripts\python.exe"
$frontendNpm = "C:\Program Files\nodejs\npm.cmd"
$cmdExe = "C:\Windows\System32\cmd.exe"

function Test-HttpReady {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Url
    )

    try {
        $null = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
        return $true
    }
    catch {
        return $false
    }
}

function Get-ManagedProcess {
    param(
        [Parameter(Mandatory = $true)]
        [string]$PidFile
    )

    if (-not (Test-Path $PidFile)) {
        return $null
    }

    $rawValue = (Get-Content $PidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
    if (-not $rawValue) {
        Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
        return $null
    }

    $managedPid = 0
    if (-not [int]::TryParse($rawValue, [ref]$managedPid)) {
        Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
        return $null
    }

    $process = Get-Process -Id $managedPid -ErrorAction SilentlyContinue
    if (-not $process) {
        Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
        return $null
    }

    return $process
}

function Get-ListeningPid {
    param(
        [Parameter(Mandatory = $true)]
        [int]$Port
    )

    $pattern = "^\s*TCP\s+\S+:$Port\s+\S+\s+LISTENING\s+(\d+)\s*$"
    foreach ($line in (netstat -ano)) {
        if ($line -match $pattern) {
            return [int]$Matches[1]
        }
    }

    return $null
}

function Save-ListenerPid {
    param(
        [Parameter(Mandatory = $true)]
        [int]$Port,
        [Parameter(Mandatory = $true)]
        [string]$PidFile,
        [Parameter(Mandatory = $true)]
        [int]$FallbackPid
    )

    $listenerPid = Get-ListeningPid -Port $Port
    if ($null -ne $listenerPid) {
        $listenerPid | Out-File -FilePath $PidFile -Encoding ascii -Force
        return $listenerPid
    }

    $FallbackPid | Out-File -FilePath $PidFile -Encoding ascii -Force
    return $FallbackPid
}

function Assert-PortAvailable {
    param(
        [Parameter(Mandatory = $true)]
        [int]$Port,
        $KnownPid,
        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    $listenerPid = Get-ListeningPid -Port $Port
    if ($null -eq $listenerPid) {
        return
    }

    if ($null -ne $KnownPid -and ($listenerPid -eq [int]$KnownPid)) {
        return
    }

    throw "$Label port $Port is already in use by another process."
}

function Wait-UntilReady {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Url,
        [Parameter(Mandatory = $true)]
        [string]$Label,
        [int]$TimeoutSeconds = 30
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if (Test-HttpReady -Url $Url) {
            return
        }
        Start-Sleep -Milliseconds 800
    }

    throw "$Label did not become ready before timeout. Run status-platform.ps1 for details."
}

if (-not (Test-Path $backendPython)) {
    throw "Backend virtual environment not found: $backendPython"
}

if (-not (Test-Path (Join-Path $frontendDir "node_modules"))) {
    throw "Frontend dependencies not found: $frontendDir\\node_modules . Run npm install in frontend first."
}

if (-not (Test-Path $frontendNpm)) {
    throw "npm was not found at $frontendNpm"
}

$backendProcess = Get-ManagedProcess -PidFile $backendPidFile
$frontendProcess = Get-ManagedProcess -PidFile $frontendPidFile
$deliverablesProcess = Get-ManagedProcess -PidFile $deliverablesPidFile

if (-not $backendProcess -and (Test-HttpReady -Url $backendUrl)) {
    $adoptedBackendPid = Get-ListeningPid -Port 8000
    if ($null -ne $adoptedBackendPid) {
        $adoptedBackendPid | Out-File -FilePath $backendPidFile -Encoding ascii -Force
        $backendProcess = Get-Process -Id $adoptedBackendPid -ErrorAction SilentlyContinue
    }
}

if (-not $frontendProcess -and (Test-HttpReady -Url $frontendUrl)) {
    $adoptedFrontendPid = Get-ListeningPid -Port 3000
    if ($null -ne $adoptedFrontendPid) {
        $adoptedFrontendPid | Out-File -FilePath $frontendPidFile -Encoding ascii -Force
        $frontendProcess = Get-Process -Id $adoptedFrontendPid -ErrorAction SilentlyContinue
    }
}

if (-not $deliverablesProcess -and (Test-HttpReady -Url $deliverablesUrl)) {
    $adoptedDeliverablesPid = Get-ListeningPid -Port 8092
    if ($null -ne $adoptedDeliverablesPid) {
        $adoptedDeliverablesPid | Out-File -FilePath $deliverablesPidFile -Encoding ascii -Force
        $deliverablesProcess = Get-Process -Id $adoptedDeliverablesPid -ErrorAction SilentlyContinue
    }
}

Assert-PortAvailable -Port 8000 -KnownPid $(if ($backendProcess) { $backendProcess.Id } else { $null }) -Label "Backend"
Assert-PortAvailable -Port 3000 -KnownPid $(if ($frontendProcess) { $frontendProcess.Id } else { $null }) -Label "Frontend"
Assert-PortAvailable -Port 8092 -KnownPid $(if ($deliverablesProcess) { $deliverablesProcess.Id } else { $null }) -Label "Deliverables"

if ($backendProcess -and (Test-HttpReady -Url $backendUrl)) {
    $backendRunningPid = Save-ListenerPid -Port 8000 -PidFile $backendPidFile -FallbackPid $backendProcess.Id
    Write-Host "Backend already running. PID: $backendRunningPid"
}
else {
    if ($backendProcess) {
        Remove-Item $backendPidFile -Force -ErrorAction SilentlyContinue
    }

    Remove-Item $backendStdoutLog, $backendStderrLog -Force -ErrorAction SilentlyContinue

    $backendStarted = Start-Process `
        -FilePath $backendPython `
        -ArgumentList @("-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000") `
        -WorkingDirectory $backendDir `
        -RedirectStandardOutput $backendStdoutLog `
        -RedirectStandardError $backendStderrLog `
        -PassThru

    try {
        Wait-UntilReady -Url $backendUrl -Label "Backend" -TimeoutSeconds 20
    }
    catch {
        Write-Host ""
        Write-Host "Backend stderr log:"
        Get-Content $backendStderrLog -ErrorAction SilentlyContinue
        throw
    }

    $backendRunningPid = Save-ListenerPid -Port 8000 -PidFile $backendPidFile -FallbackPid $backendStarted.Id
    Write-Host "Backend started. PID: $backendRunningPid"
}

if ($frontendProcess -and (Test-HttpReady -Url $frontendUrl)) {
    $frontendRunningPid = Save-ListenerPid -Port 3000 -PidFile $frontendPidFile -FallbackPid $frontendProcess.Id
    Write-Host "Frontend already running. PID: $frontendRunningPid"
}
else {
    if ($frontendProcess) {
        Remove-Item $frontendPidFile -Force -ErrorAction SilentlyContinue
    }

    $env:NEXT_PUBLIC_API_BASE = "http://127.0.0.1:8000"
    Write-Host "Building frontend..."
    Push-Location $frontendDir
    try {
        & $frontendNpm run build
    }
    finally {
        Pop-Location
    }

    $standaloneServer = Join-Path $frontendDir ".next\standalone\server.js"
    $nodeExe = Join-Path (Split-Path $frontendNpm -Parent) "node.exe"
    $frontendCommand = "set HOSTNAME=127.0.0.1 && set PORT=3000 && node `"$standaloneServer`""
    $frontendStarted = Start-Process `
        -FilePath $cmdExe `
        -ArgumentList @("/c", $frontendCommand) `
        -WorkingDirectory $frontendDir `
        -WindowStyle Hidden `
        -PassThru

    Wait-UntilReady -Url $frontendUrl -Label "Frontend" -TimeoutSeconds 30
    $frontendRunningPid = Save-ListenerPid -Port 3000 -PidFile $frontendPidFile -FallbackPid $frontendStarted.Id
    Write-Host "Frontend started. PID: $frontendRunningPid"
}

if ($deliverablesProcess -and (Test-HttpReady -Url $deliverablesUrl)) {
    $deliverablesRunningPid = Save-ListenerPid -Port 8092 -PidFile $deliverablesPidFile -FallbackPid $deliverablesProcess.Id
    Write-Host "Deliverables already running. PID: $deliverablesRunningPid"
}
else {
    if ($deliverablesProcess) {
        Remove-Item $deliverablesPidFile -Force -ErrorAction SilentlyContinue
    }

    $deliverablesStarted = Start-Process `
        -FilePath $backendPython `
        -ArgumentList @("-m", "http.server", "8092", "--bind", "127.0.0.1", "--directory", $root) `
        -WorkingDirectory $root `
        -WindowStyle Hidden `
        -PassThru

    Wait-UntilReady -Url $deliverablesUrl -Label "Deliverables" -TimeoutSeconds 15
    $deliverablesRunningPid = Save-ListenerPid -Port 8092 -PidFile $deliverablesPidFile -FallbackPid $deliverablesStarted.Id
    Write-Host "Deliverables started. PID: $deliverablesRunningPid"
}

Write-Host ""
Write-Host "Platform ready:"
Write-Host "Frontend: http://127.0.0.1:3000"
Write-Host "Backend: http://127.0.0.1:8000/health"
Write-Host "Admin: http://127.0.0.1:3000/admin/login"
Write-Host "Deliverables via frontend: http://127.0.0.1:3000/deliverables/static-html-demo/index.html"
Write-Host "Deliverables via static server: $deliverablesUrl"
