from pydantic import BaseModel, Field
from typing import List, Dict, Literal


class StudentProfile(BaseModel):
    interests: List[str] = Field(
        ..., example=["backend", "problem-solving"]
    )

    skills: Dict[str, Literal["beginner", "intermediate", "advanced"]] = Field(
        ..., example={"python": "beginner", "logic": "intermediate"}
    )

    time_per_week: int = Field(
        ..., ge=1, le=60, example=10
    )

    learning_pace: Literal["slow", "medium", "fast"] = Field(
        ..., example="medium"
    )

    goal: str = Field(
        ..., example="software engineering"
    )
