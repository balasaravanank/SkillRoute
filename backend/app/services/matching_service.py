"""
Clarity scoring engine — rule-based logic layer for career decision-making.
This is the "Logic Layer" referenced in the project pitch.
"""


def calculate_clarity_score(assessment: dict) -> dict:
    """
    Rule-based clarity scoring from 3 quick assessment questions.
    Returns a clarity score (0-100) and clarity level.
    """
    score = 0

    # Question 1: Do you have a career in mind?
    career_mind = assessment.get("has_career_in_mind", "no")
    if career_mind == "yes":
        score += 40
    elif career_mind == "somewhat":
        score += 20
    # "no" = 0

    # Question 2: Familiarity with tech career paths
    familiarity = assessment.get("familiarity_with_paths", "not_at_all")
    if familiarity == "very":
        score += 35
    elif familiarity == "somewhat":
        score += 18
    # "not_at_all" = 0

    # Question 3: Primary goal specificity
    goal = assessment.get("primary_goal", "exploring")
    goal_scores = {
        "full_time_job": 25,
        "internship": 20,
        "learning": 12,
        "exploring": 5,
    }
    score += goal_scores.get(goal, 5)

    # Determine clarity level
    if score >= 70:
        level = "focused"
        message = "You have a clear direction! The agent will fine-tune the best path for you."
    elif score >= 40:
        level = "narrowing"
        message = "You have some idea — the agent will evaluate multiple paths and pick the best fit."
    else:
        level = "exploring"
        message = "You're still exploring — the agent will analyze your profile deeply to discover the right path."

    return {
        "clarity_score": min(score, 100),
        "clarity_level": level,
        "message": message,
        "breakdown": {
            "career_direction": career_mind,
            "path_familiarity": familiarity,
            "goal_specificity": goal,
        }
    }


def analyze_industry_demand(career: str) -> dict:
    """
    Industry demand analysis with richer signal data.
    """
    trending_careers = {
        "ai engineer": {"demand": "trending", "growth": "very_high", "salary": "$100k-$180k"},
        "machine learning engineer": {"demand": "trending", "growth": "very_high", "salary": "$110k-$190k"},
        "data scientist": {"demand": "trending", "growth": "high", "salary": "$90k-$160k"},
        "full stack developer": {"demand": "trending", "growth": "high", "salary": "$80k-$150k"},
        "cloud architect": {"demand": "trending", "growth": "very_high", "salary": "$120k-$200k"},
        "devops engineer": {"demand": "trending", "growth": "high", "salary": "$90k-$160k"},
        "cybersecurity specialist": {"demand": "trending", "growth": "very_high", "salary": "$95k-$170k"},
        "blockchain developer": {"demand": "emerging", "growth": "moderate", "salary": "$85k-$160k"},
    }

    stable_careers = {
        "software engineer": {"demand": "stable", "growth": "moderate", "salary": "$80k-$150k"},
        "web developer": {"demand": "stable", "growth": "moderate", "salary": "$60k-$120k"},
        "mobile developer": {"demand": "stable", "growth": "moderate", "salary": "$75k-$140k"},
        "backend developer": {"demand": "stable", "growth": "moderate", "salary": "$75k-$140k"},
        "frontend developer": {"demand": "stable", "growth": "moderate", "salary": "$70k-$130k"},
        "qa engineer": {"demand": "stable", "growth": "low", "salary": "$60k-$110k"},
    }

    career_lower = career.lower()

    for key, data in trending_careers.items():
        if key in career_lower:
            return {
                "demand_level": data["demand"],
                "growth_projection": data["growth"],
                "avg_salary_range": data["salary"],
                "job_openings_estimate": "high",
            }

    for key, data in stable_careers.items():
        if key in career_lower:
            return {
                "demand_level": data["demand"],
                "growth_projection": data["growth"],
                "avg_salary_range": data["salary"],
                "job_openings_estimate": "moderate",
            }

    return {
        "demand_level": "stable",
        "growth_projection": "moderate",
        "avg_salary_range": "$60k-$120k",
        "job_openings_estimate": "moderate",
    }


def generate_career_insights(profile: dict, career_decision: dict) -> dict:
    """Generate enriched career insights from AI decision data."""
    career = career_decision.get("career", "")
    demand_info = analyze_industry_demand(career)

    return {
        "career": career,
        "confidence": career_decision.get("confidence", 0),
        "skill_match": career_decision.get("skill_match_percentage", 0),
        "market_readiness": career_decision.get("market_readiness", 0),
        "industry_demand": demand_info,
        "strengths": career_decision.get("key_strengths", []),
        "gaps": career_decision.get("skill_gaps", []),
        "time_to_ready": career_decision.get("time_to_job_ready", "N/A"),
        "reasoning": career_decision.get("reasoning", ""),
        "alternatives": career_decision.get("alternatives", []),
        "decision_trace": career_decision.get("decision_trace", []),
    }
