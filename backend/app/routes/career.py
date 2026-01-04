from fastapi import APIRouter, HTTPException, Depends
from app.models.student import StudentProfile
from app.services.career_agent import decide_career
from app.services.roadmap_agent import generate_roadmap
from app.services.storage_service import save_career_analysis, get_active_roadmap
from app.services.matching_service import generate_career_insights, calculate_skill_match
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


@router.get("/insights")
def get_career_insights(user_id: str = Depends(verify_firebase_token)):
    """Get detailed career insights and decision support"""
    try:
        roadmap = get_active_roadmap(user_id)
        if not roadmap:
            return {"message": "No career decision found. Please generate a roadmap first."}
        
        career_decision = roadmap.get("career_decision", {})
        
        # Generate comprehensive insights
        profile = roadmap.get("profile", {})
        insights = generate_career_insights(profile, career_decision)
        
        return {
            "status": "success",
            "insights": insights
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/alternatives")
def get_alternative_careers(user_id: str = Depends(verify_firebase_token)):
    """Get alternative career suggestions"""
    try:
        roadmap = get_active_roadmap(user_id)
        if not roadmap:
            return {"message": "No career decision found"}
        
        career_decision = roadmap.get("career_decision", {})
        alternatives = career_decision.get("alternatives", [])
        
        return {
            "status": "success",
            "current_career": career_decision.get("career"),
            "alternatives": alternatives
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/roadmap")
def delete_roadmap(user_id: str = Depends(verify_firebase_token)):
    """Delete the current roadmap to allow fresh generation"""
    try:
        from app.services.storage_service import delete_active_roadmap
        
        success = delete_active_roadmap(user_id)
        if success:
            return {
                "status": "success",
                "message": "Career path reset successfully. You can now generate a new roadmap."
            }
        else:
            return {
                "status": "error", 
                "message": "No roadmap found to delete"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


