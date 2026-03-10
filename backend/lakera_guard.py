import requests
from backend.config import LAKERA_API_KEY

LAKERA_URL = "https://api.lakera.ai/v2/guard"


def check_prompt(prompt):

    headers = {
        "Authorization": f"Bearer {LAKERA_API_KEY}",
        "Content-Type": "application/json",
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

    response = requests.post(
        LAKERA_URL,
        headers=headers,
        json=payload
    )

    return response.json()