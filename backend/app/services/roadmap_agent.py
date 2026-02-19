import os
import json
from groq import Groq

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

SYSTEM_PROMPT = """
You are SkillRoute AgentX — an autonomous AI Decision-Making Agent for career path selection.

Your mission: Eliminate career ambiguity by analyzing the student's multi-dimensional profile and committing to an optimal career path with full reasoning transparency.

## Agent Decision Protocol

Follow this exact reasoning pipeline:

1. **ASSESS CLARITY** — Read the student's clarity_score and adjust your approach:
   - Low clarity (0-39): Cast a wide net, evaluate 5+ career paths, explain each thoroughly
   - Medium clarity (40-69): Evaluate 3-4 paths near their interests, compare tradeoffs
   - High clarity (70-100): Validate their direction, optimize the path, flag any risks

2. **EVALUATE CAREERS** — For each candidate career path, score against:
   - Skill match (how well current skills transfer)
   - Interest alignment (does it match stated interests?)
   - Feasibility (can they reach job-readiness given their time and pace?)
   - Market demand (job availability and growth)

3. **DECIDE** — Select the single best-fit career path. Commit to it with reasoning.

4. **EXPLAIN REJECTIONS** — For each alternative, explain WHY it was not the best pick.

5. **GENERATE ROADMAP** — Build a phased learning plan adapted to:
   - Their available time per week (if provided)
   - Their learning pace preference (if provided)
   - 4-6 phases with clear progression
   - Include specific resources and milestones

## Input Profile Fields
- name, education, skills, interests, goals, experience
- time_per_week (hours available for learning, may be null)
- learning_pace ("slow"/"medium"/"fast", may be null)
- clarity_score (0-100, may be null — treat null as 50)

Return ONLY valid JSON in this exact format (NO MARKDOWN, NO CODE BLOCKS):
{
  "career_decision": {
    "career": "<career title>",
    "reasoning": "<detailed explanation of why this career was chosen>",
    "confidence": <number 0-100>,
    "skill_match_percentage": <number 0-100>,
    "market_readiness": <number 0-100>,
    "industry_demand": "<trending|stable|emerging>",
    "key_strengths": ["<strength 1>", "<strength 2>"],
    "skill_gaps": ["<gap 1>", "<gap 2>"],
    "time_to_job_ready": "<estimated months>",
    "decision_trace": [
      {"step": "Input Analysis", "detail": "<what the agent observed from the profile>"},
      {"step": "Paths Evaluated", "detail": "<list of career paths considered and why>"},
      {"step": "Comparison", "detail": "<how paths were scored against each other>"},
      {"step": "Decision", "detail": "<final reasoning for the selected path>"},
      {"step": "Plan Strategy", "detail": "<approach for building the roadmap>"}
    ],
    "alternatives": [
      {
        "career": "<alt career>",
        "match_score": <0-100>,
        "reason": "<why this is a good alternative>",
        "rejection_reason": "<why this was NOT selected as the best>"
      }
    ]
  },
  "learning_roadmap": {
    "duration_months": <number>,
    "roadmap": [
      {
        "phase": "Phase 1: Foundations",
        "duration": "4-6 weeks",
        "difficulty": "<beginner|intermediate|advanced>",
        "focus_skills": ["skill1", "skill2"],
        "outcomes": ["outcome1", "outcome2"],
        "milestones": [
          {
            "name": "<milestone name>",
            "description": "<what to achieve>",
            "estimated_hours": <number>,
            "resources": [
              {
                "type": "<course|documentation|project|video>",
                "title": "<resource title>",
                "url": "<url or description>",
                "duration": "<time estimate>"
              }
            ]
          }
        ],
        "prerequisites": ["<prerequisite 1>", "<prerequisite 2>"]
      }
    ]
  }
}
"""

async def generate_roadmap(profile: dict) -> dict:
    max_retries = 2
    retry_count = 0

    while retry_count < max_retries:
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": json.dumps(profile)}
                ],
                temperature=1,
                max_completion_tokens=8000,
                top_p=1,
                stream=False
            )

            content = response.choices[0].message.content
            print(f"DEBUG: Raw content type: {type(content)}")
            print(f"DEBUG: Raw content: {content[:500]}...") # Print first 500 chars

            # Remove markdown code blocks if present
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            
            content = content.strip()

            try:
                return json.loads(content)
            except json.JSONDecodeError as e:
                print(f"JSON Decode Error: {e}")
                print(f"Failed Content: {content}")
                raise ValueError(f"Roadmap agent returned invalid JSON: {e}")
        except Exception as e:
            print(f"Error in roadmap generation: {e}")
            retry_count += 1
            if retry_count >= max_retries:
                raise


ADAPT_SYSTEM_PROMPT = """
You are SkillRoute AgentX — an autonomous AI Roadmap Adapter.

Your task:
- Analyze the student's current roadmap and their progress data.
- If they are progressing well (high streak, phases on track), suggest advanced topics or speed up the timeline.
- If they are stuck or slow (low streak, stalled progress), suggest remedial resources, break down steps further, or extend timelines.
- Keep the structure consistent with the original roadmap but modify future phases.
- Provide a brief adaptation_reasoning explaining what changed and why.

Input JSON:
{
  "current_roadmap": { ... },
  "progress": { "completed_phases": X, "total_phases": Y, "streak_days": Z, "days_since_activity": N }
}

Return ONLY valid JSON:
{
  "adaptation_reasoning": "<brief explanation of what was changed and why>",
  "duration_months": <number>,
  "roadmap": [
    {
      "phase": "Phase X: ...",
      "duration": "...",
      "difficulty": "<beginner|intermediate|advanced>",
      "focus_skills": [...],
      "outcomes": [...],
      "milestones": [
        {
          "name": "...",
          "description": "...",
          "estimated_hours": <number>,
          "resources": [
            {
              "type": "<course|documentation|project|video>",
              "title": "...",
              "url": "...",
              "duration": "..."
            }
          ]
        }
      ]
    }
  ]
}
"""

async def adapt_roadmap(current_data: dict) -> dict:
    # Calculate days since last activity for smarter adaptation
    progress = current_data.get("progress", {})
    last_active = progress.get("last_activity_date")
    days_since_activity = 0

    if last_active:
        from datetime import datetime
        try:
            last_date = datetime.fromisoformat(last_active).date()
            days_since_activity = (datetime.utcnow().date() - last_date).days
        except (ValueError, TypeError):
            days_since_activity = 0

    input_data = {
        "current_roadmap": current_data.get("learning_roadmap"),
        "progress": {
            **progress,
            "days_since_activity": days_since_activity,
        }
    }

    max_retries = 2
    retry_count = 0

    while retry_count < max_retries:
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": ADAPT_SYSTEM_PROMPT},
                    {"role": "user", "content": json.dumps(input_data)}
                ],
                temperature=1,
                max_completion_tokens=8000,
                top_p=1,
                stream=False
            )

            content = response.choices[0].message.content
            
            # Remove markdown code blocks if present
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            
            content = content.strip()

            try:
                return json.loads(content)
            except json.JSONDecodeError:
                print(f"JSON Decode Error in adapt_roadmap. Content: {content[:100]}...")
                return current_data.get("learning_roadmap")
        except Exception as e:
            print(f"Error in adapt_roadmap: {e}")
            retry_count += 1
            if retry_count >= max_retries:
                return current_data.get("learning_roadmap")
            import asyncio
            await asyncio.sleep(1)
