# Platform Launcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Windows-friendly one-click launcher workflow at the repository root for starting, stopping, and checking the local platform.

**Architecture:** Implement three PowerShell entry scripts and one batch wrapper at the repository root. The start script owns process bootstrap and health checks, the stop script owns PID-based shutdown, and the status script owns human-readable runtime inspection. The frontend should build first and then run with `npm run start` so the launcher can keep it in the background reliably on Windows.

**Tech Stack:** PowerShell, batch wrapper, existing FastAPI/uvicorn backend, existing Next.js frontend, Python `unittest` regression check.

---

### Task 1: Add regression coverage for launcher entrypoints

**Files:**
- Create: `tests/test_platform_launcher_scripts.py`

- [ ] **Step 1: Write the failing test**

```python
def test_launcher_scripts_exist(self):
    ...
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m unittest tests.test_platform_launcher_scripts -v`
Expected: FAIL because the root launcher files do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create the four launcher files at the repository root.

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m unittest tests.test_platform_launcher_scripts -v`
Expected: PASS for the file existence checks.

### Task 2: Implement background start/stop/status scripts

**Files:**
- Create: `start-platform.ps1`
- Create: `stop-platform.ps1`
- Create: `status-platform.ps1`
- Create: `start-platform.bat`

- [ ] **Step 1: Implement `start-platform.ps1`**

It should validate prerequisites, clean stale PID files, prevent duplicate launches, start backend and frontend in hidden background processes, and wait for `/health` plus `/`.

- [ ] **Step 2: Implement `stop-platform.ps1`**

It should read PID files, terminate the process tree for each known service, and remove stale PID files.

- [ ] **Step 3: Implement `status-platform.ps1`**

It should inspect PID files plus HTTP reachability and print a concise Chinese status summary.

- [ ] **Step 4: Implement `start-platform.bat`**

It should call `powershell.exe -ExecutionPolicy Bypass -File "%~dp0start-platform.ps1"`.

### Task 3: Verify the workflow end to end

**Files:**
- Test: `tests/test_platform_launcher_scripts.py`
- Test: `start-platform.ps1`
- Test: `stop-platform.ps1`
- Test: `status-platform.ps1`

- [ ] **Step 1: Run unit checks**

Run: `python -m unittest tests.test_platform_launcher_scripts -v`
Expected: PASS

- [ ] **Step 2: Run start script**

Run: `powershell -ExecutionPolicy Bypass -File .\start-platform.ps1`
Expected: backend and frontend both report healthy.

- [ ] **Step 3: Run status script**

Run: `powershell -ExecutionPolicy Bypass -File .\status-platform.ps1`
Expected: both services report running and show local URLs.

- [ ] **Step 4: Run stop script**

Run: `powershell -ExecutionPolicy Bypass -File .\stop-platform.ps1`
Expected: both services stop cleanly and PID files are removed or marked stale.

- [ ] **Step 5: Re-run status script**

Run: `powershell -ExecutionPolicy Bypass -File .\status-platform.ps1`
Expected: both services report stopped.
