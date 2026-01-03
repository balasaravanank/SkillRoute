from fastapi import APIRouter
from app.models.student import StudentProfile

router = APIRouter(
    prefix="/career",
    tags=["Career"]
)

@router.post("/analyze")
def analyze_profile(profile: StudentProfile):
    """
    Phase 2:
    - Accept student profile
    - Validate input
    - Return validated data
    """

    return {
        "status": "success",
        "message": "Student profile validated successfully",
        "data": profile
    }
