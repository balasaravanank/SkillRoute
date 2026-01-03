from fastapi import APIRouter, HTTPException
from app.models.student import StudentProfile
from app.services.career_agent import decide_career
from app.services.roadmap_agent import generate_roadmap
from app.services.storage_service import save_career_analysis

router = APIRouter(
    prefix="/career",
    tags=["Career"]
)

@router.post("/analyze")
def analyze_profile(profile: StudentProfile):
    try:
        # TEMP user_id (Auth comes in Phase 6)
        user_id = "test_user_001"

        career_decision = decide_career(profile.dict())
        roadmap = generate_roadmap(
            career_decision["career"],
            profile.dict()
        )

        save_career_analysis(
            user_id=user_id,
            profile=profile.dict(),
            career_decision=career_decision,
            roadmap=roadmap
        )

        return {
            "status": "success",
            "career_decision": career_decision,
            "learning_roadmap": roadmap,
            "saved": True
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
