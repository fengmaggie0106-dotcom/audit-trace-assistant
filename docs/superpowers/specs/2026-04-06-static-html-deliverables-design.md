# Static HTML Deliverables Design

## Goal

Produce two HTML-based deliverables from the current "业审追溯助手" repository without changing the core tech stack:

1. `deliverables/static-html-demo/`
   A polished multi-page static demo site for presentation, review, and offline sharing.
2. `deliverables/html-export/`
   A pure HTML export that mirrors the current frontend's information architecture and route structure as closely as possible, but runs without Next.js or the backend.

Both deliverables should be directly openable in a browser and useful when deployment is blocked.

## Why This Exists

The user needs something they can:

- open immediately in a browser
- share as files or as a zipped folder
- use for competition demos and stakeholder review
- continue refining later even if formal public deployment is not ready

The repository already contains a stronger product structure in the Next.js frontend, so the HTML work should reuse that structure instead of inventing a new IA.

## Scope

### In Scope

- Create standalone HTML/CSS/JS deliverables under a new `deliverables/` directory.
- Include multi-page navigation between:
  - homepage
  - case entry
  - history search
  - case detail
  - dashboard
  - AI assistant
  - admin-related pages
- Embed realistic sample content and demo data.
- Reuse the current product positioning, terminology, and page hierarchy.
- Make pages look professional and presentation-ready.
- Keep all pages static and browser-openable with no build step required.

### Out of Scope

- Real database persistence inside the deliverables
- Real admin authentication
- Real API calls
- Full fidelity export of every dynamic behavior from the current app
- Replacing the existing Next.js/FastAPI product

## Deliverable A: Static Demo Site

### Purpose

This version is optimized for presentation quality and storytelling. It should feel like a polished competition demo website rather than a code export artifact.

### Directory

`deliverables/static-html-demo/`

### Planned Files

- `index.html`
- `case-entry.html`
- `search.html`
- `case-detail.html`
- `dashboard.html`
- `ai.html`
- `admin.html`
- `assets/styles.css`
- `assets/app.js`

### Experience Principles

- High visual consistency
- Strong homepage narrative
- Highly legible case detail page
- Dashboard suited for screenshots and walkthroughs
- Lightweight interactions only

### Content Approach

Use curated demo data that clearly shows:

- cross-year traceability
- structured audit case recording
- reasoning process, not just conclusions
- risk rules and display configuration concepts
- admin-editable content examples

## Deliverable B: Pure HTML Export

### Purpose

This version is optimized to mirror the current formal website structure. It should feel like the static HTML analogue of the existing frontend.

### Directory

`deliverables/html-export/`

### Planned Files

- `index.html`
- `search.html`
- `cases-new.html`
- `case-1.html`
- `dashboard.html`
- `ai.html`
- `admin-login.html`
- `admin-content.html`
- `admin-cases.html`
- `admin-rules.html`
- `admin-display.html`
- `assets/styles.css`
- `assets/app.js`

### Experience Principles

- Preserve current route semantics in filenames
- Preserve the current page hierarchy and platform framing
- Use shared styling with the static demo where appropriate
- Use embedded mock data instead of API calls

## Architecture

### Shared Strategy

Create a small static-site pattern with:

- one shared stylesheet per deliverable
- one shared JavaScript file per deliverable
- repeated shell structure:
  - top navigation
  - optional sidebar
  - main content area

### Data Strategy

Use embedded JSON-like demo data inside `app.js` or inline page constants to power:

- homepage cards
- search tables
- case detail metadata
- dashboard charts simulated with CSS bars
- admin content previews

No external dependencies should be required.

### Interaction Strategy

Keep interactions lightweight and resilient:

- page links between HTML files
- filter chips and search input visual behavior
- fake save buttons with success feedback
- tab switching where useful

If browser file-origin restrictions make some JS patterns unreliable, prefer pure inline page content over dynamic fetching.

## Visual Design

### Shared Direction

- Enterprise B-end product style
- Deep blue, teal-blue, gray-white palette
- Clean spacing and clear information hierarchy
- Minimal motion
- No flashy marketing gradients

### Reusable Design System

Define CSS variables for:

- background
- panel
- border
- foreground
- muted foreground
- accent
- success
- warning
- danger

Reusable components:

- top nav
- side nav
- stat card
- section card
- metadata list
- tag chip
- status badge
- table
- form group
- timeline block

## Testing Strategy

### Manual Verification

For each deliverable:

- open every HTML page directly in the browser
- verify navigation between pages
- verify CSS and JS assets load from relative paths
- verify no obvious console errors during static use
- verify key pages are presentation-ready:
  - homepage
  - case detail
  - dashboard
  - admin page(s)

### Project Verification

- ensure new deliverable files do not break the existing frontend/backend
- keep work isolated under `deliverables/`

## File Plan

### New Directories

- `deliverables/static-html-demo/`
- `deliverables/static-html-demo/assets/`
- `deliverables/html-export/`
- `deliverables/html-export/assets/`

### Likely Documentation Updates

- `README.md`
- `docs/deployment.md`

Documentation updates should mention that these HTML deliverables are offline/demo artifacts, not the main production deployment target.

## Risks and Mitigations

### Risk: Demo and export versions drift visually

Mitigation:
- Keep one shared design language
- Let page purpose differ more than raw styling

### Risk: Static pages feel fake or too shallow

Mitigation:
- Use rich case detail content
- Include meaningful metadata, trace sections, and rule/config examples

### Risk: Browser file opening breaks dynamic loading

Mitigation:
- Avoid fetch-based local loading
- Prefer embedded or script-defined data

## Recommended Implementation Order

1. Build shared styles and shell for both deliverables
2. Build static demo pages
3. Build export pages aligned to current app structure
4. Add lightweight interactions
5. Update documentation
6. Verify every page manually

## Acceptance Criteria

The work is complete when:

1. Both `deliverables/static-html-demo/` and `deliverables/html-export/` exist
2. Each deliverable includes the required HTML pages
3. Each deliverable opens directly in a browser without a build step
4. Key product pages are visually presentable
5. Existing app code remains intact
6. The user can use the HTML outputs as a fallback visualized website package
