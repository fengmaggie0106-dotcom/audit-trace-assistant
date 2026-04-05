# Audit Trace Assistant Platform Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reshape the current CRUD prototype into a business-aligned "业审追溯助手" demo platform with professional pages, traceable case detail, and deployable frontend/backend services.

**Architecture:** Keep the existing Next.js frontend and FastAPI backend, but split the product into business pages and shared UI modules. Expand the case schema so one case captures the full audit trace chain, then build filtered search, detail, dashboard, AI-assistant demo flows, and deployment assets on top of the same API.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, FastAPI, SQLAlchemy, MySQL/PyMySQL, Uvicorn

---

### Task 1: Reshape product information architecture and case schema

**Files:**
- Create: `frontend/app/cases/new/page.tsx`
- Create: `frontend/app/cases/[id]/page.tsx`
- Create: `frontend/app/search/page.tsx`
- Create: `frontend/app/dashboard/page.tsx`
- Create: `frontend/app/ai/page.tsx`
- Create: `frontend/lib/api.ts`
- Create: `frontend/lib/types.ts`
- Create: `backend/seed.py`
- Modify: `frontend/app/page.tsx`
- Modify: `backend/models.py`
- Modify: `backend/schemas.py`
- Modify: `backend/main.py`
- Modify: `backend/database.py`

- [ ] Expand the backend case entity to include the business fields required by the report: problem summary, background, dispute process, judgment basis, final conclusion, reference entry, attachment links, tags, issue type, voucher reference, company, fiscal year, account code, risk level, source, status, creator, timestamps.
- [ ] Add backend query parameters for keyword, company, year, account, and tag filters, plus a detail endpoint response shape that returns complete structured case data.
- [ ] Add a lightweight seed/init path so the demo has representative cases and dashboard data on first run.
- [ ] Split the frontend from a single page into business routes for homepage, case intake, search, case detail, dashboard, and AI assistant.
- [ ] Centralize API fetching and shared TypeScript types so all pages read the same case structure.

### Task 2: Build a professional traceable case detail and search flow

**Files:**
- Create: `frontend/components/cases/case-detail-header.tsx`
- Create: `frontend/components/cases/case-trace-sections.tsx`
- Create: `frontend/components/cases/case-metadata-panel.tsx`
- Create: `frontend/components/cases/case-search-filters.tsx`
- Create: `frontend/components/cases/case-results-table.tsx`
- Modify: `frontend/app/search/page.tsx`
- Modify: `frontend/app/cases/[id]/page.tsx`

- [ ] Build the search page with company, year, account, keyword, and tag filters mapped to backend query params.
- [ ] Make search results navigable into the case detail page.
- [ ] Design the case detail page around traceability, not CRUD: summary, background, dispute process, judgment basis, conclusion, reference entry, attachments, tags, risk, and metadata.
- [ ] Make the detail page independently demoable with clear section hierarchy, dense but readable layout, and explicit business wording.

### Task 3: Apply a restrained enterprise UI system and rewrite the homepage narrative

**Files:**
- Create: `frontend/components/layout/app-shell.tsx`
- Create: `frontend/components/layout/top-nav.tsx`
- Create: `frontend/components/layout/side-nav.tsx`
- Create: `frontend/components/ui/page-header.tsx`
- Create: `frontend/components/ui/stat-card.tsx`
- Create: `frontend/components/ui/section-card.tsx`
- Create: `frontend/components/ui/status-badge.tsx`
- Create: `frontend/components/ui/tag-chip.tsx`
- Modify: `frontend/app/layout.tsx`
- Modify: `frontend/app/globals.css`
- Modify: `frontend/app/page.tsx`
- Modify: `frontend/app/search/page.tsx`
- Modify: `frontend/app/cases/new/page.tsx`
- Modify: `frontend/app/cases/[id]/page.tsx`
- Modify: `frontend/app/dashboard/page.tsx`
- Modify: `frontend/app/ai/page.tsx`

- [ ] Establish a shared visual system using deep blue, cyan-blue, slate, and white with consistent spacing, border radius, card shells, forms, badges, tables, and typography.
- [ ] Add a reusable top navigation and side navigation that expose the key pages.
- [ ] Rewrite the homepage to communicate platform positioning, dual-party value, four core capabilities, the business loop, scenario entries, and direct navigation links without turning it into a marketing landing page.
- [ ] Upgrade the dashboard and AI pages so they visually fit the same enterprise system and support demo storytelling.

### Task 4: Add deployability, docs, and final verification

**Files:**
- Create: `README.md`
- Create: `docs/deployment.md`
- Create: `frontend/.env.example`
- Create: `backend/.env.example`
- Create: `.env.example`
- Create: `backend/railway.toml`
- Modify: `frontend/README.md`
- Modify: `frontend/package.json`
- Modify: `frontend/next.config.ts`
- Modify: `backend/requirements.txt`
- Modify: `backend/database.py`

- [ ] Ensure frontend build/runtime scripts and environment variable usage work for local development and Vercel deployment.
- [ ] Add Vercel deployment instructions, build command, output behavior, route refresh guidance, and environment variable examples.
- [ ] Ensure backend requirements and runtime entrypoint work for Railway deployment with a MySQL connection string supplied by environment variables.
- [ ] Add backend environment variable templates and production startup guidance, including database initialization/migration notes that match the actual code.
- [ ] Write a deployment guide for non-developers covering local run, GitHub prep, Vercel, Railway, MySQL, env vars, custom domains, troubleshooting, and verification.
- [ ] Run fresh verification commands for backend syntax, frontend build, and route/API integration before claiming completion.
