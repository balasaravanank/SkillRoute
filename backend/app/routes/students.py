from fastapi import APIRouter, HTTPException, Depends
from app.models.student import StudentProfile
from app.services.storage_service import get_student_profile, save_student_profile
from app.utils.auth import verify_firebase_token

router = APIRouter(
    prefix="/api/students",
    tags=["Students"]
)

@router.get("/profile")
def get_profile(user_id: str = Depends(verify_firebase_token)):
    """Get student profile"""
    try:
        profile = get_student_profile(user_id)
        if not profile:
            return {"message": "No profile found"}
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/profile")
def save_profile(
    profile: StudentProfile,
    user_id: str = Depends(verify_firebase_token)
):
    """Save or update student profile"""
    try:
        save_student_profile(user_id, profile.dict())
        return {
            "status": "success",
            "message": "Profile saved successfully",
            "profile": profile.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
