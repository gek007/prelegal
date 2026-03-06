# PreLegal - AI-Powered Legal Document Generation

V1 foundation with fake authentication, Docker containerization, and backend API.

## Quick Start

### Using Docker (Recommended)

**Windows:**
```powershell
.\scripts\start-windows.ps1
```

**Linux/macOS:**
```bash
./scripts/start-linux.sh
```

The application will be available at [http://localhost:8000](http://localhost:8000)

### Manual Setup

**Backend:**
```bash
# Install dependencies
pip install fastapi uvicorn sqlalchemy passlib[bcrypt] python-jose[cryptography] python-multipart

# Run backend
cd backend
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
# Install dependencies
cd frontend
npm install

# Run development server
npm run dev
```

## Features

- ✅ **Fake Authentication**: Login with any email/password
- ✅ **Mutual NDA Generator**: Fill form, see live preview, download PDF
- ✅ **Docker Containerization**: Single container for entire application
- ✅ **Backend API**: FastAPI with SQLite database
- ✅ **Template System**: 11 legal document templates from Common Paper

## Project Structure

```
prelegal/
├── backend/              # FastAPI backend
│   ├── main.py          # API endpoints
│   ├── database.py      # SQLite setup
│   ├── auth.py          # Fake authentication
│   └── templates/       # Legal templates
├── frontend/            # Next.js frontend
│   ├── app/
│   │   ├── login/       # Login page
│   │   └── dashboard/   # MNDA generator
│   └── components/
│       └── header.tsx   # Navigation header
├── scripts/             # Startup scripts
│   ├── start-windows.ps1
│   └── start-linux.sh
└── Dockerfile           # Multi-stage build
```

## API Endpoints

- `POST /api/login` - Fake login
- `GET /api/me` - Get current user
- `GET /api/templates` - List templates
- `GET /api/templates/{filename}` - Get template
- `GET /api/health` - Health check

## Development

### Backend Development
```bash
cd backend
uvicorn main:app --reload
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Build for Production
```bash
cd frontend
npm run build
```

## Stopping the Application

**Windows:**
```powershell
.\scripts\stop-windows.ps1
```

**Linux/macOS:**
```bash
./scripts/stop-linux.sh
```

Or with Docker:
```bash
docker-compose down
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.13, SQLAlchemy
- **Database**: SQLite
- **Containerization**: Docker, docker-compose
- **PDF Generation**: html2pdf.js

## License

Legal templates are licensed under CC BY 4.0 from Common Paper.
