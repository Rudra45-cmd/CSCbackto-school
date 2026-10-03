from dotenv import load_dotenv
load_dotenv('backend/.env')

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.database import Base, engine
from backend.app.models.ai_memory import AIMemory
from backend.app.models.announcement import Announcement, AnnouncementRead
from backend.app.models.community import CommunityLike, CommunityPost, CommunityReply
from backend.app.models.user import User
from backend.app.routes.ai import router as ai_router
from backend.app.routes.announcements import router as announcements_router
from backend.app.routes.community import router as community_router
from backend.app.routes.auth import router as auth_router
from backend.app.routes.assignments import router as assignments_router
from backend.app.routes import study_sessions

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="StudySync API",
    version="1.0.0",
    description="Backend API for StudySync student workspace.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://potential-orbit-r4rxg556jq76hw77q-5173.app.github.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "name": "StudySync API",
        "status": "online",
        "version": "1.0.0",
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "studysync-backend",
    }

app.include_router(auth_router)
app.include_router(assignments_router)
app.include_router(study_sessions.router)

app.include_router(ai_router)
app.include_router(community_router)
app.include_router(announcements_router)
