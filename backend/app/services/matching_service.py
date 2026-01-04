"""
Skill matching and career analysis service
"""

def calculate_skill_match(profile_skills: list, required_skills: list) -> dict:
    """
    Calculate skill match score between profile and career requirements
    
    Args:
        profile_skills: List of skills from student profile
        required_skills: List of required skills for career
        
    Returns:
        Dictionary with match analysis
    """
    if not required_skills:
        return {
            "match_percentage": 0,
            "matched_skills": [],
            "missing_skills": [],
            "transferable_skills": []
        }
    
    profile_set = set(skill.lower() for skill in profile_skills)
    required_set = set(skill.lower() for skill in required_skills)
    
    matched = profile_set.intersection(required_set)
    missing = required_set.difference(profile_set)
    
    # Simple match percentage
    match_percentage = int((len(matched) / len(required_set)) * 100) if required_set else 0
    
    return {
        "match_percentage": match_percentage,
        "matched_skills": list(matched),
        "missing_skills": list(missing),
        "transferable_skills": []  # Could be enhanced with AI analysis
    }


def analyze_industry_demand(career: str) -> dict:
    """
    Analyze industry demand for a career (simplified version)
    In production, this would connect to job market APIs
    
    Args:
        career: Career title
        
    Returns:
        Dictionary with demand analysis
    """
    # Simplified demand mapping - in production, use real data
    trending_careers = [
        "ai engineer", "machine learning engineer", "data scientist",
        "full stack developer", "cloud architect", "devops engineer",
        "cybersecurity specialist", "blockchain developer"
    ]
    
    stable_careers = [
        "software engineer", "web developer", "mobile developer",
        "backend developer", "frontend developer", "qa engineer"
    ]
    
    career_lower = career.lower()
    
    if any(trend in career_lower for trend in trending_careers):
        demand = "trending"
        growth = "high"
    elif any(stable in career_lower for stable in stable_careers):
        demand = "stable"
        growth = "moderate"
    else:
        demand = "stable"
        growth = "moderate"
    
    return {
        "demand_level": demand,
        "growth_projection": growth,
        "job_openings_estimate": "moderate to high",  # Placeholder
        "avg_salary_range": "$60k - $120k"  # Placeholder
    }


def generate_career_insights(profile: dict, career_decision: dict) -> dict:
    """
    Generate comprehensive career insights
    
    Args:
        profile: Student profile data
        career_decision: Career decision from AI
        
    Returns:
        Dictionary with detailed insights
    """
    career = career_decision.get("career", "")
    
    # Analyze demand
    demand_info = analyze_industry_demand(career)
    
    # Get skill information from career decision
    key_strengths = career_decision.get("key_strengths", [])
    skill_gaps = career_decision.get("skill_gaps", [])
    
    insights = {
        "career": career,
        "confidence": career_decision.get("confidence", 0),
        "skill_match": career_decision.get("skill_match_percentage", 0),
        "market_readiness": career_decision.get("market_readiness", 0),
        "industry_demand": demand_info,
        "strengths": key_strengths,
        "gaps": skill_gaps,
        "time_to_ready": career_decision.get("time_to_job_ready", "N/A"),
        "reasoning": career_decision.get("reasoning", ""),
        "alternatives": career_decision.get("alternatives", [])
    }
    
    return insights
