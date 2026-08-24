import json

from google import genai
from google.genai import types

from app.config import GEMINI_API_KEY


client = genai.Client(api_key=GEMINI_API_KEY)


def analyze_citizen_request(text: str):

    prompt = f"""
You are an AI system for Digital Public Infrastructure and Governance.

Analyze this citizen complaint:

{text}

Return the analysis using these fields:

- category
- sub_category
- priority
- issue
- summary
- location
- sentiment

Rules:

category: infrastructure category
sub_category: specific issue
priority: Low, Medium, High, or Critical
issue: short description
summary: one sentence
location: location if mentioned, otherwise null
sentiment: Positive, Neutral, or Negative
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    try:
        return json.loads(response.text)

    except json.JSONDecodeError:
        return {
            "error": "Gemini returned invalid JSON",
            "raw_response": response.text
        }