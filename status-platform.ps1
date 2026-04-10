$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPidFile = Join-Path $root "backend\.backend_pid"
$frontendPidFile = Join-Path $root "frontend\.frontend_pid"
$deliverablesPidFile = Join-Path $root ".deliverables_server_pid"

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

function Get-ServiceState {
    param(
        [Parameter(Mandatory = $true)]
        [string]$PidFile,
        [Parameter(Mandatory = $true)]
        [string]$Url,
        [Parameter(Mandatory = $true)]
        [int]$Port
    )

    $pidValue = $null
    $process = $null

    if (Test-Path $PidFile) {
        $rawValue = (Get-Content $PidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
        $parsedPid = 0
        if ([int]::TryParse($rawValue, [ref]$parsedPid)) {
            $pidValue = $parsedPid
            $process = Get-Process -Id $parsedPid -ErrorAction SilentlyContinue
        }
        else {
            Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
        }
    }

    $healthy = Test-HttpReady -Url $Url
    $listenerPid = Get-ListeningPid -Port $Port

    if (-not $process -and $null -ne $listenerPid) {
        $listenerProcess = Get-Process -Id $listenerPid -ErrorAction SilentlyContinue
        if ($listenerProcess) {
            $listenerPid | Out-File -FilePath $PidFile -Encoding ascii -Force
            $process = $listenerProcess
            $pidValue = $listenerPid
        }
    }

    if (-not $process -and -not $healthy) {
        return "stopped"
    }

    if ($process -and $healthy) {
        return "running (PID: $pidValue, healthy)"
    }

    if ($process) {
        return "process exists (PID: $pidValue), but health check failed"
    }

    return "reachable, but PID file is missing or invalid"
}

Write-Host "Platform status"
Write-Host "Backend: $(Get-ServiceState -PidFile $backendPidFile -Url 'http://127.0.0.1:8000/health' -Port 8000)"
Write-Host "Frontend: $(Get-ServiceState -PidFile $frontendPidFile -Url 'http://127.0.0.1:3000' -Port 3000)"
Write-Host "Deliverables: $(Get-ServiceState -PidFile $deliverablesPidFile -Url 'http://127.0.0.1:8092/deliverables/static-html-demo/index.html' -Port 8092)"
Write-Host "Frontend URL: http://127.0.0.1:3000"
Write-Host "Backend health: http://127.0.0.1:8000/health"
Write-Host "Admin URL: http://127.0.0.1:3000/admin/login"
Write-Host "Deliverables URL (frontend): http://127.0.0.1:3000/deliverables/static-html-demo/index.html"
Write-Host "Deliverables URL (8092): http://127.0.0.1:8092/deliverables/static-html-demo/index.html"
