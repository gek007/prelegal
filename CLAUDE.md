# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory. The user can AI chat in order to establish what document they want and how to fill in the fields. The available documents are covered in `catalog.json` in the project root.

**Current State:** Frontend-only prototype that supports Mutual NDA document generation with live preview (no AI chat yet).

**Vision:** AI-powered assistant to guide users through document selection and field completion.

**Project Components:**
- **Template repository**: 11 legal document templates from Common Paper (CC BY 4.0 licensed)
- **Next.js frontend**: Web application for generating documents with live preview
- **Planned backend**: Python FastAPI with uv, Docker containerized

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

### Docker & Backend Structure

The entire project should be packaged into a Docker container:
- **Backend**: `backend/` directory - Python FastAPI with uv package manager
- **Frontend**: `frontend/` directory - Next.js application
- **Serving**: Consider statically building the frontend and serving it via FastAPI

**Backend endpoint**: http://localhost:8000

### Startup Scripts

Scripts for starting/stopping the application:

**Windows:**
- `scripts/start-windows.ps1`
- `scripts/stop-windows.ps1`

**Linux/macOS:**
- `scripts/start.sh`
- `scripts/stop.sh`

### Template System

Legal templates use a custom placeholder system with `<span class="coverpage_link">FieldName</span>` markers. For example:

```markdown
This agreement commences on the <span class="coverpage_link">Effective Date</span> and expires at the end of the <span class="coverpage_link">MNDA Term</span>.
```

The application replaces these placeholders with user input. Common placeholders include:
- Purpose, Effective Date, MNDA Term, Term of Confidentiality
- Governing Law, Jurisdiction

### Frontend Architecture

**App Structure (Next.js 15 App Router):**
```
frontend/
├── app/
│   ├── page.tsx              # Main page with form + preview layout
│   └── layout.tsx            # Root layout
├── components/
│   ├── mnda-form.tsx         # Form component with MNDAFormData interface
│   ├── document-preview.tsx  # Live document preview
│   └── ui/                   # Shadcn UI components (button, input, label, textarea)
├── lib/
│   ├── pdf-generator.ts      # PDF generation with html2pdf.js
│   └── utils.ts              # Utility functions (cn for class merging)
└── public/templates/         # Template files served at /templates/
```

**Data Flow:**
1. User enters data in `MNDAForm` component
2. Form state lifted to parent via `onChange` callback
3. Parent passes form data to `DocumentPreview` component
4. Preview fetches template from `/templates/` and replaces placeholders
5. On submit, `generateMNDApdf()` generates cover page + filled template as PDF

**Key Patterns:**
- **Client-side only**: PDF generation uses dynamic import to avoid SSR issues (`const html2pdf = (await import('html2pdf.js')).default`)
- **Live preview**: Document preview updates in real-time as user types
- **TypeScript interfaces**: `MNDAFormData` interface defines form structure
- **Shadcn UI**: Minimal UI components with `className` prop support
- **Tailwind CSS**: Utility-first styling with `cn()` helper for class merging

### Catalog Metadata

`catalog.json` contains metadata for all 11 templates:
- Template name, description, filename
- Source (Common Paper), version, URL
- License information (all CC BY 4.0)

**Available templates:** Mutual NDA, CSA, SLA, DPA, PSA, Design Partner Agreement, Partnership Agreement, Software License Agreement, Pilot Agreement, BAA, AI Addendum.

## Development Commands

### Frontend (Next.js)
```bash
cd frontend
npm install              # Install dependencies
npm run dev             # Start development server (http://localhost:3000)
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
```

### Template Management
Templates are stored in `templates/` directory and copied to `frontend/public/templates/` for serving. When adding new templates:
1. Add template file to `templates/` directory
2. Copy to `frontend/public/templates/`
3. Update `catalog.json` with template metadata

## Color Scheme

Use these colors for UI elements:

- **Accent Yellow**: `#ecad0a` - Highlights, notifications
- **Blue Primary**: `#209dd7` - Primary buttons, links
- **Purple Secondary**: `#753991` - Submit buttons, CTAs
- **Dark Navy**: `#032147` - Headings, primary text
- **Gray Text**: `#888888` - Secondary text, placeholders

## Adding New Document Types

To add a generator for a new document type (e.g., CSA):

1. **Create form component**: `components/csa-form.tsx` with `CSAFormData` interface
2. **Update PDF generator**: Add `generateCSApdf()` function in `lib/pdf-generator.ts`
3. **Copy template**: `cp templates/CSA.md frontend/public/templates/`
4. **Create page**: `app/csa/page.tsx` with form + preview layout
5. **Identify placeholders**: Search template for `<span class="coverpage_link">` patterns

## Important Notes

- **Client-side PDF**: html2pdf.js must be dynamically imported to avoid "self is not defined" errors during SSR
- **Template placeholders**: Always use regex with global flag for replacement: `.replace(/pattern/g, replacement)`
- **Date formatting**: Use `toLocaleDateString()` for consistent date formatting
- **Cover page generation**: PDF generator creates cover page with party info, terms summary, and signature blocks
- **Markdown to HTML**: Simple regex-based conversion in `convertMarkdownToHTML()` function
- **Form validation**: Uses HTML5 `required` attribute for basic validation
- **Responsive layout**: Uses `lg:grid-cols-2` for side-by-side on desktop, stacks on mobile
- **Color usage**: Apply defined color scheme consistently across components
