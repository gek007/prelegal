from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
import os

# Get the backend directory absolute path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))

from database import get_db, init_db
from auth import fake_authenticate, create_access_token

# Initialize database
init_db()

# FastAPI app
app = FastAPI(title="PreLegal API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    email: str

# Auth endpoints
@app.post("/api/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Fake login - accepts any email/password combination."""
    user = fake_authenticate(db, request.email, request.password)
    if not user:
        raise HTTPException(status_code=400, detail="Login failed")

    access_token = create_access_token(data={"sub": user.email})
    return LoginResponse(access_token=access_token, email=user.email)

@app.get("/api/me")
async def get_current_user():
    """Get current user info (simplified - just returns stored email from token)."""
    # For fake auth, we'll just return a simple response
    # In real implementation, this would decode and verify JWT
    return {"message": "User authenticated"}

# Template serving
@app.get("/api/templates/{filename}", response_class=PlainTextResponse)
async def get_template(filename: str):
    """Serve legal document templates."""
    template_path = os.path.join(BACKEND_DIR, "templates", filename)

    if not os.path.exists(template_path):
        raise HTTPException(status_code=404, detail="Template not found")

    with open(template_path, "r") as f:
        content = f.read()

    return content

@app.get("/api/templates")
async def list_templates():
    """List all available templates."""
    templates_dir = os.path.join(BACKEND_DIR, "templates")
    if not os.path.exists(templates_dir):
        return {"templates": []}

    templates = [
        f for f in os.listdir(templates_dir)
        if f.endswith(".md")
    ]
    return {"templates": templates}

# Health check
@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

# Serve static frontend files (for production)
# In development, frontend runs separately
@app.get("/{path:path}")
async def serve_frontend(path: str):
    """Serve frontend static files."""
    frontend_path = f"./frontend/out/{path}"

    if path == "" or path == "/":
        frontend_path = "./frontend/out/index.html"

    if os.path.exists(frontend_path):
        return FileResponse(frontend_path)

    # Fallback to index.html for SPA routing
    if os.path.exists("./frontend/out/index.html"):
        return FileResponse("./frontend/out/index.html")

    raise HTTPException(status_code=404, detail="Not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
