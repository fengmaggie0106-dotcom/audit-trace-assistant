$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPidFile = Join-Path $root "backend\.backend_pid"
$frontendPidFile = Join-Path $root "frontend\.frontend_pid"
$deliverablesPidFile = Join-Path $root ".deliverables_server_pid"

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

function Stop-Pid {
    param(
        [Parameter(Mandatory = $true)]
        [int]$TargetPid
    )

    $process = Get-Process -Id $TargetPid -ErrorAction SilentlyContinue
    if (-not $process) {
        return
    }

    try {
        Stop-Process -Id $TargetPid -Force -ErrorAction Stop
    }
    catch {
        try {
            & taskkill /PID $TargetPid /T /F | Out-Null
        }
        catch {
        }
    }
}

function Get-PidsFromPidFile {
    param(
        [Parameter(Mandatory = $true)]
        [string]$PidFile
    )

    $pids = @()

    if (-not (Test-Path $PidFile)) {
        return $pids
    }

    $rawValue = (Get-Content $PidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
    $managedPid = 0
    if ([int]::TryParse($rawValue, [ref]$managedPid)) {
        $pids += $managedPid
    }
    else {
        Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
    }

    return $pids
}

function Stop-ManagedService {
    param(
        [Parameter(Mandatory = $true)]
        [string]$PidFile,
        [Parameter(Mandatory = $true)]
        [string]$Label,
        [Parameter(Mandatory = $true)]
        [int]$Port
    )

    $pidsToStop = Get-PidsFromPidFile -PidFile $PidFile
    $listenerPid = Get-ListeningPid -Port $Port
    if ($null -ne $listenerPid -and ($pidsToStop -notcontains $listenerPid)) {
        $pidsToStop += $listenerPid
    }

    if (@($pidsToStop).Count -eq 0) {
        Write-Host "$Label is not running."
        return
    }

    foreach ($pidToStop in (@($pidsToStop) | Sort-Object -Unique)) {
        Stop-Pid -TargetPid $pidToStop
    }

    Start-Sleep -Seconds 2
    Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
    $remainingListener = Get-ListeningPid -Port $Port
    if ($null -eq $remainingListener) {
        Write-Host "$Label stopped."
    }
    else {
        Write-Host "$Label listener still exists on port $Port (PID: $remainingListener)."
    }
}

Stop-ManagedService -PidFile $frontendPidFile -Label "Frontend" -Port 3000
Stop-ManagedService -PidFile $deliverablesPidFile -Label "Deliverables" -Port 8092
Stop-ManagedService -PidFile $backendPidFile -Label "Backend" -Port 8000
