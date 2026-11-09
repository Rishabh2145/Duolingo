import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import init_db
from seed import seed_database
from routers import courses, lessons, users, leaderboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB & Seed data
    init_db()
    seed_database()
    yield


app = FastAPI(
    title="Duolingo Clone API",
    version="1.0.0",
    description="Backend API for Duolingo Web App assignment",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(courses.router)
app.include_router(lessons.router)
app.include_router(users.router)
app.include_router(leaderboard.router)


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Duolingo Clone API",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
