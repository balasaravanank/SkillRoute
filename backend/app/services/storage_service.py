from app.utils.firebase import db
from datetime import datetime


def save_career_analysis(
    user_id: str,
    profile: dict,
    career_decision: dict,
    roadmap: dict
):
    data = {
        "profile": profile,
        "career_decision": career_decision,
        "roadmap": roadmap,
        "created_at": datetime.utcnow()
    }

    db.collection("users") \
      .document(user_id) \
      .collection("analyses") \
      .add(data)

    return True
