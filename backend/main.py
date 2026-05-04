import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.upload import router as upload_router
from routes.analyze import router as analyze_router
from routes.charts import router as charts_router
from services.db import init_db


load_dotenv()

# CORS Configuration
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://myc-ai-dashboard.vercel.app",
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
]

# En production, utiliser des origines spécifiques
if os.getenv("ENVIRONMENT") == "production":
    ALLOWED_ORIGINS = [
        "https://myc-ai-dashboard.vercel.app",
        os.getenv("FRONTEND_URL"),
    ]

app = FastAPI(
    title="AI Dashboard Pro API",
    description="API REST pour uploader, analyser et visualiser des fichiers CSV/Excel.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event() -> None:
    init_db()


@app.get("/")
def healthcheck() -> dict:
    return {"status": "ok", "message": "AI Dashboard Pro API is running"}


app.include_router(upload_router)
app.include_router(analyze_router)
app.include_router(charts_router)
