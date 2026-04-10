# Static HTML Deliverables Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build two browser-openable HTML deliverables that visualize the "业审追溯助手" platform without requiring Next.js, FastAPI, or deployment.

**Architecture:** Create two standalone static site directories under `deliverables/`, each with its own shared stylesheet and small JavaScript file. Reuse the current product structure and sample business content, but keep behavior static and resilient to direct `file:///` opening.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Python unittest for file-level verification

---

### Task 1: Add deliverable verification test

**Files:**
- Create: `tests/test_static_html_deliverables.py`

- [ ] **Step 1: Write the failing test**

```python
import pathlib
import unittest


class StaticHtmlDeliverablesTest(unittest.TestCase):
    def test_expected_entry_points_exist(self):
        root = pathlib.Path(__file__).resolve().parents[1]
        expected = [
            root / "deliverables" / "static-html-demo" / "index.html",
            root / "deliverables" / "html-export" / "index.html",
        ]
        for path in expected:
            self.assertTrue(path.exists(), f"Missing deliverable file: {path}")


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m unittest tests.test_static_html_deliverables -v`
Expected: FAIL because the `deliverables/` HTML files do not exist yet

- [ ] **Step 3: Write minimal implementation**

Create the `deliverables/static-html-demo/index.html` and `deliverables/html-export/index.html` files so the test has real entry points to detect.

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m unittest tests.test_static_html_deliverables -v`
Expected: PASS for the entry-point existence check

- [ ] **Step 5: Commit**

```bash
git add tests/test_static_html_deliverables.py deliverables/
git commit -m "feat: scaffold static html deliverables"
```

### Task 2: Build shared assets for both deliverables

**Files:**
- Create: `deliverables/static-html-demo/assets/styles.css`
- Create: `deliverables/static-html-demo/assets/app.js`
- Create: `deliverables/html-export/assets/styles.css`
- Create: `deliverables/html-export/assets/app.js`

- [ ] **Step 1: Write the failing test**

Extend `tests/test_static_html_deliverables.py` with a test that asserts the four shared asset files exist and contain recognizable design-system markers like `:root`, `.topbar`, `.sidebar`, and `window.demoData`.

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m unittest tests.test_static_html_deliverables -v`
Expected: FAIL because the shared asset files do not exist yet

- [ ] **Step 3: Write minimal implementation**

Add:
- a shared enterprise-style CSS system for each deliverable
- a lightweight JS helper for nav highlighting, mock notifications, and embedded demo data

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m unittest tests.test_static_html_deliverables -v`
Expected: PASS for the shared asset existence/content checks

- [ ] **Step 5: Commit**

```bash
git add tests/test_static_html_deliverables.py deliverables/static-html-demo/assets deliverables/html-export/assets
git commit -m "feat: add shared assets for html deliverables"
```

### Task 3: Implement `static-html-demo`

**Files:**
- Create: `deliverables/static-html-demo/index.html`
- Create: `deliverables/static-html-demo/case-entry.html`
- Create: `deliverables/static-html-demo/search.html`
- Create: `deliverables/static-html-demo/case-detail.html`
- Create: `deliverables/static-html-demo/dashboard.html`
- Create: `deliverables/static-html-demo/ai.html`
- Create: `deliverables/static-html-demo/admin.html`

- [ ] **Step 1: Write the failing test**

Extend `tests/test_static_html_deliverables.py` with a test that checks every `static-html-demo` page exists and includes:
- a `<title>`
- a linked stylesheet under `assets/styles.css`
- navigation text such as `首页` or `风险看板`

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m unittest tests.test_static_html_deliverables -v`
Expected: FAIL until the pages are added with the expected structure

- [ ] **Step 3: Write minimal implementation**

Build the seven demo pages with:
- a presentation-grade homepage
- professional case detail content
- search/table page
- dashboard cards and chart-like sections
- AI assistant mock conversation
- admin control center mock page

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m unittest tests.test_static_html_deliverables -v`
Expected: PASS for all `static-html-demo` page checks

- [ ] **Step 5: Commit**

```bash
git add tests/test_static_html_deliverables.py deliverables/static-html-demo
git commit -m "feat: add multi-page static html demo site"
```

### Task 4: Implement `html-export`

**Files:**
- Create: `deliverables/html-export/index.html`
- Create: `deliverables/html-export/search.html`
- Create: `deliverables/html-export/cases-new.html`
- Create: `deliverables/html-export/case-1.html`
- Create: `deliverables/html-export/dashboard.html`
- Create: `deliverables/html-export/ai.html`
- Create: `deliverables/html-export/admin-login.html`
- Create: `deliverables/html-export/admin-content.html`
- Create: `deliverables/html-export/admin-cases.html`
- Create: `deliverables/html-export/admin-rules.html`
- Create: `deliverables/html-export/admin-display.html`

- [ ] **Step 1: Write the failing test**

Extend `tests/test_static_html_deliverables.py` with a test that checks every `html-export` page exists and includes:
- a `<title>`
- a linked stylesheet under `assets/styles.css`
- current-route-like labels such as `历史查询`, `案例详情`, or `后台`

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m unittest tests.test_static_html_deliverables -v`
Expected: FAIL until the export pages are added

- [ ] **Step 3: Write minimal implementation**

Build the export pages to mirror the current app structure with:
- top navigation
- side navigation
- route-aligned page names
- embedded content instead of API fetching

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m unittest tests.test_static_html_deliverables -v`
Expected: PASS for all `html-export` page checks

- [ ] **Step 5: Commit**

```bash
git add tests/test_static_html_deliverables.py deliverables/html-export
git commit -m "feat: add pure html export version of platform"
```

### Task 5: Document and verify

**Files:**
- Modify: `README.md`
- Modify: `docs/deployment.md`

- [ ] **Step 1: Write the failing test**

Extend `tests/test_static_html_deliverables.py` with a test that checks `README.md` mentions `deliverables/static-html-demo` and `deliverables/html-export`.

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m unittest tests.test_static_html_deliverables -v`
Expected: FAIL because the documentation does not mention both deliverables yet

- [ ] **Step 3: Write minimal implementation**

Document:
- what each deliverable is
- how to open the HTML pages locally
- that they are demo/export artifacts rather than production deployment targets

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m unittest tests.test_static_html_deliverables -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/test_static_html_deliverables.py README.md docs/deployment.md
git commit -m "docs: document static html deliverables"
```

### Task 6: Final verification

**Files:**
- Verify only

- [ ] **Step 1: Run the automated verification**

Run: `python -m unittest tests.test_static_html_deliverables -v`
Expected: PASS

- [ ] **Step 2: Run a browser-openability smoke test**

Run a small command that checks representative files are readable:

```bash
python - <<'PY'
from pathlib import Path
for path in [
    Path("deliverables/static-html-demo/index.html"),
    Path("deliverables/static-html-demo/case-detail.html"),
    Path("deliverables/html-export/index.html"),
    Path("deliverables/html-export/admin-content.html"),
]:
    print(path, path.exists(), path.stat().st_size > 0)
PY
```

Expected: all files exist and have non-zero size

- [ ] **Step 3: Manual page opening checklist**

Open locally in the browser:
- `deliverables/static-html-demo/index.html`
- `deliverables/static-html-demo/case-detail.html`
- `deliverables/html-export/index.html`
- `deliverables/html-export/admin-content.html`

Expected:
- CSS loads
- navigation links resolve
- pages look presentation-ready

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "chore: finalize static html deliverables"
```
