from fastapi import FastAPI
from app.config import PROJECT_NAME, ENV
from app.routes.career import router as career_router

app = FastAPI(
    title=PROJECT_NAME,
    description="SkillRoute – AI-powered career path & learning roadmap agent",
    version="1.0.0"
)

app.include_router(career_router)

@app.get("/")
def root():
    return {
        "app": PROJECT_NAME,
        "env": ENV,
        "status": "running"
    }

