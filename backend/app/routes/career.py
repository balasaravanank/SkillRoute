from fastapi import APIRouter, HTTPException, Depends
from app.models.student import StudentProfile
from app.services.career_agent import decide_career
from app.services.roadmap_agent import generate_roadmap
from app.services.storage_service import save_career_analysis
from app.utils.auth import verify_firebase_token

router = APIRouter(
    prefix="/career",
    tags=["Career"]
)

@router.post("/analyze")
def analyze_profile(
    profile: StudentProfile,
    user_id: str = Depends(verify_firebase_token)
):
    try:
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
            "user_id": user_id,
            "career_decision": career_decision,
            "learning_roadmap": roadmap
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
