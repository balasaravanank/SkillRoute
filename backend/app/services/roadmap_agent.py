import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
You are an AI Learning Roadmap Planner.

Your task:
- Create a realistic learning roadmap for a given career
- Adapt it to the student's time_per_week and learning pace
- Keep the roadmap practical and beginner-friendly
- Avoid overwhelming the student

Rules:
- Break roadmap into phases or months
- Each phase must have:
  - focus_skills
  - learning_outcomes
- Be concise
- Return ONLY valid JSON

JSON format:
{
  "duration_months": <number>,
  "roadmap": [
    {
      "phase": "Month 1",
      "focus_skills": ["skill1", "skill2"],
      "outcomes": ["outcome1", "outcome2"]
    }
  ]
}
"""

def generate_roadmap(career: str, profile: dict) -> dict:
    prompt_input = {
        "career": career,
        "student_profile": profile
    }

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps(prompt_input)}
        ],
        temperature=0.3
    )

    content = response.choices[0].message.content

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        raise ValueError("Roadmap agent returned invalid JSON")
