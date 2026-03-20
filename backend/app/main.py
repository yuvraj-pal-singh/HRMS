"""
main.py — HRMS Lite FastAPI application entry point.

Responsibilities:
  - Application lifespan: connect / disconnect MongoDB
  - CORS middleware (allows the React frontend on any origin in dev;
    lock down allow_origins in production)
  - Mount all route prefixes
  - Health-check endpoints
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import connect_db, close_db
from app.routes import employee_routes, attendance_routes, dashboard_routes


# ---------------------------------------------------------------------------
# Lifespan  (replaces deprecated @app.on_event)
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Connect to MongoDB on startup; close the connection on shutdown."""
    await connect_db()
    yield
    await close_db()


# ---------------------------------------------------------------------------
# App instance
# ---------------------------------------------------------------------------

app = FastAPI(
    title="HRMS Lite API",
    description=(
        "Backend for the Nexus HR Workspace — "
        "manages employees, attendance, and dashboard statistics."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",       # Swagger UI
    redoc_url="/redoc",     # ReDoc
)


# ---------------------------------------------------------------------------
# CORS  — allow the React dev server (and Vercel deployment) to call this API
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # ← tighten to your Vercel URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Global exception handler — always return JSON, never HTML 500 pages
# ---------------------------------------------------------------------------

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"},
    )


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

app.include_router(employee_routes.router)
app.include_router(attendance_routes.router)
app.include_router(dashboard_routes.router)


# ---------------------------------------------------------------------------
# Health check endpoints
# ---------------------------------------------------------------------------

@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "HRMS Lite API is running."}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
