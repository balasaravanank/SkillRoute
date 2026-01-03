from fastapi import FastAPI
from app.config import PROJECT_NAME

app = FastAPI(
    title=PROJECT_NAME,
    description="SkillRoute – AI-powered career path and learning roadmap agent",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "app": PROJECT_NAME,
        "status": "running",
        "message": "Welcome to the SkillRoute API!"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
