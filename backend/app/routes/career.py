from fastapi import APIRouter, HTTPException, Depends
from app.models.student import StudentProfile
from app.services.career_agent import decide_career
from app.services.roadmap_agent import generate_roadmap
from app.services.storage_service import save_career_analysis, get_active_roadmap
from app.utils.auth import verify_firebase_token

router = APIRouter(
    prefix="/api/career",
    tags=["Career"]
)

@router.get("/roadmap")
def get_current_roadmap(user_id: str = Depends(verify_firebase_token)):
    """Get the student's current active roadmap"""
    roadmap = get_active_roadmap(user_id)
    if not roadmap:
        return {"message": "No active roadmap found"}
    return roadmap


@router.post("/roadmap")
def generate_career_roadmap(
    profile: StudentProfile,
    user_id: str = Depends(verify_firebase_token)
):
    try:
        profile_dict = profile.dict()
        
        # Generate complete roadmap with career decision
        result = generate_roadmap(profile_dict)
        
        career_decision = result.get("career_decision", {})
        learning_roadmap = result.get("learning_roadmap", {})

        save_career_analysis(
            user_id=user_id,
            profile=profile_dict,
            career_decision=career_decision,
            roadmap=learning_roadmap
        )

        return {
            "status": "success",
            "user_id": user_id,
            "career_decision": career_decision,
            "learning_roadmap": learning_roadmap
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
