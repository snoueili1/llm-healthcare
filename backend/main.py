from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
LAKERA_API_KEY = os.getenv("LAKERA_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

SYSTEM_PROMPT = """
You are a healthcare assistant for a hospital.

Rules:
- Provide safe and responsible health information
- Stay professional
- Do not provide unsafe medical advice
"""


def analyze_lakera(prompt):
    url = "https://api.lakera.ai/v2/guard"
    headers = {
        "Authorization": f"Bearer {LAKERA_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ], 
        "breakdown": True
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        data = response.json()
        return data
    except:
        return {"flagged": False}

def classify_from_breakdown(breakdown: list) -> str:
    for item in breakdown:
        if item.get("detected"):
            detector_type = item.get("detector_type", "")
            labels = {
                "prompt_attack":                    "Prompt Attack",
                "pii/us_social_security_number":    "PII – SSN",
                "pii/phone_number":                 "PII – Phone",
                "pii/email":                        "PII – Email",
                "pii/name":                         "PII – Name",
                "pii/credit_card":                  "PII – Credit Card",
                "moderated_content/crime":          "Crime",
                "moderated_content/hate":           "Hate Speech",
                "moderated_content/violence":       "Violence",
                "moderated_content/weapons":        "Weapons",
                "unknown_links":                    "Unknown Links",
            }
            return labels.get(detector_type, detector_type) 
    return "Adversarial Prompt"

@app.post("/chat")
async def chat(request: Request):

    data = await request.json()

    prompt = data.get("prompt")
    use_lakera = data.get("use_lakera")

    if use_lakera:
        lakera_result = analyze_lakera(prompt)

        if lakera_result.get("flagged"):
            breakdown = lakera_result.get("breakdown", [])
            threat_type = classify_from_breakdown(breakdown)
            return {
                "blocked": True,
                "blocked_by": "lakera",
                "threat": threat_type, 
                "breakdown": lakera_result.get("breakdown", [])
            }

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]
    )

    text = completion.choices[0].message.content
    return {
        "response": text
    }