# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory. The user can AI chat in order to establish what document they want and how to fill in the fields. The available documents are covered in `catalog.json` in the project root.

**Current State:** v1 foundation with backend authentication, Docker containerization, and fake login.

**Vision:** AI-powered assistant to guide users through document selection and field completion.

## Project Components:
- **Template repository**: 11 legal document templates from Common Paper (CC BY 4.0 licensed)
- **Next.js frontend**: Web application for generating documents with live preview
- **FastAPI backend**: Python backend with SQLite database, fake authentication
- **Docker setup**: Multi-stage Docker build with startup scripts

## Development Process

When instructed to build a feature:

1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature using the feature-dev workflow
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your GitHub tools

## AI Integration

When implementing AI chat features:

1. **API Provider**: Use LiteLLM via OpenRouter
2. **Model**: gpt-oss-120b with Cerebras as inference provider
3. **Integration**: API calls should go through backend/ FastAPI endpoints
4. **Structured Outputs**: Use OpenAI Structured Outputs for populating form fields in legal documents

## Technical Architecture

### Backend Structure (FastAPI + SQLite)
```
backend/
├── main.py              # FastAPI app with auth endpoints
├── database.py          # SQLite setup with User model
├── auth.py              # Fake authentication logic
├── templates/           # Legal document templates
└── prelegal.db          # SQLite database (created on startup)
```

**API Endpoints:**
- `POST /api/login` - Fake login (accepts any email/password)
- `GET /api/me` - Get current user info
- `GET /api/templates/{filename}` - Serve legal templates
- `GET /api/templates` - List all templates
- `GET /api/health` - Health check

**Database:**
- SQLite with single `users` table (id, email, password_hash, created_at)
- Database created fresh on container startup
- Fake auth creates users on-the-fly

### Frontend Architecture (Next.js 15)
```
frontend/
├── app/
│   ├── page.tsx         # Root page (redirects to login/dashboard)
│   ├── login/page.tsx   # Login page
│   ├── dashboard/page.tsx # MNDA generator (protected)
│   └── layout.tsx       # Root layout with Header
├── components/
│   ├── header.tsx       # Navigation header with logout
│   ├── mnda-form.tsx    # MNDA form component
│   └── document-preview.tsx # Live preview
└── lib/
    ├── pdf-generator.ts # PDF generation
    └── api.ts           # API client (fetch wrapper)
```

**Authentication Flow:**
1. User visits `/` → redirects to `/login` if not authenticated
2. User enters any email/password → POST to `/api/login`
3. Backend accepts any credentials, returns fake JWT
4. Frontend stores token in `localStorage`
5. Redirect to `/dashboard` (MNDA generator)
6. Header shows user email and logout button

**Environment Variables:**
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:8000`)

### Docker & Startup Scripts

**Docker Setup:**
- Multi-stage Dockerfile (builds frontend, runs backend)
- Single container serves both frontend and backend
- Hot reload enabled in development mode

**Startup Scripts:**
- `scripts/start-windows.ps1` - Windows start script
- `scripts/stop-windows.ps1` - Windows stop script
- `scripts/start-linux.sh` - Linux/macOS start script
- `scripts/stop-linux.sh` - Linux/macOS stop script

**To start the application:**
```bash
# Windows
.\scripts\start-windows.ps1

# Linux/macOS
./scripts/start-linux.sh
```

**To stop the application:**
```bash
# Windows
.\scripts\stop-windows.ps1

# Linux/macOS
./scripts/stop-linux.sh
```

### Template System

Legal templates use a custom placeholder system with `<span class="coverpage_link">FieldName</span>` markers.

**Templates Location:**
- Source: `templates/` directory in project root
- Backend serves from: `backend/templates/`
- Accessed via: `GET /api/templates/{filename}`

**Available Templates:** Mutual NDA, CSA, SLA, DPA, PSA, Design Partner Agreement, Partnership Agreement, Software License Agreement, Pilot Agreement, BAA, AI Addendum.

## Development Commands

### Docker (Recommended)
```bash
# Start the application
docker-compose up --build

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Backend Only (Development)
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Frontend Only (Development)
```bash
cd frontend
npm install
npm run dev    # http://localhost:3000
npm run build  # Build for production
```

## Color Scheme

- **Accent Yellow**: `#ecad0a` - Highlights, notifications
- **Blue Primary**: `#209dd7` - Primary buttons, links
- **Purple Secondary**: `#753991` - Submit buttons, CTAs
- **Dark Navy**: `#032147` - Headings, primary text
- **Gray Text**: `#888888` - Secondary text, placeholders

## Important Notes

- **Fake Authentication**: Login accepts any email/password combination (no real validation)
- **SQLite Database**: Created fresh on each container startup (data not persisted)
- **Template Serving**: Templates served by backend API, not from frontend public directory
- **Client-side PDF**: html2pdf.js must be dynamically imported to avoid SSR issues
- **Protected Routes**: `/dashboard` requires authentication (checks localStorage)
- **CORS**: Backend allows all origins for development (restrict in production)

---

## Recent Implementation (March 2026)

**Jira Ticket:** PREL-4 - Build foundation v1 product

**Implementation Summary:**
- ✅ FastAPI backend with SQLite database and User model
- ✅ Fake authentication system (accepts any credentials, creates users on-the-fly)
- ✅ JWT token generation and session management
- ✅ Login page at `/login` with email/password form
- ✅ Protected dashboard at `/dashboard` (MNDA generator requires auth)
- ✅ Header component with user email display and logout button
- ✅ Multi-stage Dockerfile (builds frontend static files, serves via FastAPI)
- ✅ Startup scripts for Windows (PowerShell) and Linux/macOS (bash)
- ✅ Template serving via backend API (`/api/templates/*`)
- ✅ Health check endpoint (`/api/health`)
- ✅ Updated documentation (CLAUDE.md, README.md)

**Files Changed:** 33 new files, 8 modified files, ~1,700 lines added

**Key Architecture Decisions:**
- Single container design (frontend built to static, served by FastAPI)
- Minimal changes approach (fast implementation, maintainable structure)
- Fake auth suitable for v1 foundation (easily upgradeable to real auth)
- Hot reload support in development mode
- Automated health checks in startup scripts

**Usage:**
```bash
# Windows
.\scripts\start-windows.ps1

# Linux/macOS
./scripts/start-linux.sh

# Then visit http://localhost:8000
```

**Next Steps (Future Work):**
- Real authentication with password validation
- User registration flow
- Document history tracking in database
- AI chat integration (LiteLLM + OpenRouter + Cerebras)
- Additional document types beyond MNDA
- Production deployment configuration
