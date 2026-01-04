import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
You are an AI Career Decision Agent.

Your job:
- Analyze a student's profile comprehensively
- Choose ONE best-fit career path based on skills, interests, time availability, and market demand
- Provide detailed reasoning with specific data points
- Calculate skill match percentage and market readiness
- Suggest 2-3 alternative career paths
- Be realistic and practical

Return ONLY valid JSON in this exact format:
{
  "career": "<career name>",
  "reasoning": "<detailed explanation with specific reasons>",
  "confidence": <number between 0 and 100>,
  "skill_match_percentage": <number between 0 and 100>,
  "market_readiness": <number between 0 and 100>,
  "industry_demand": "<trending|stable|declining>",
  "key_strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "skill_gaps": ["<gap 1>", "<gap 2>"],
  "time_to_job_ready": "<estimated months>",
  "alternatives": [
    {
      "career": "<alternative career 1>",
      "match_score": <0-100>,
      "reason": "<why this is a good alternative>"
    },
    {
      "career": "<alternative career 2>",
      "match_score": <0-100>,
      "reason": "<why this is a good alternative>"
    }
  ]
}
"""

def decide_career(profile: dict) -> dict:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps(profile)}
        ],
        temperature=0.2
    )

    content = response.choices[0].message.content

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON")
