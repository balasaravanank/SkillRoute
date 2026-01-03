from fastapi import APIRouter, HTTPException
from app.models.student import StudentProfile
from app.services.career_agent import decide_career
from app.services.roadmap_agent import generate_roadmap

router = APIRouter(
    prefix="/career",
    tags=["Career"]
)

@router.post("/analyze")
def analyze_profile(profile: StudentProfile):
    try:
        # Phase 3: Career decision
        career_decision = decide_career(profile.dict())

        career_name = career_decision["career"]

        # Phase 4: Roadmap generation
        roadmap = generate_roadmap(career_name, profile.dict())

        return {
            "status": "success",
            "career_decision": career_decision,
            "learning_roadmap": roadmap
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
