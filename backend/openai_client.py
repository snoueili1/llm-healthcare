from openai import OpenAI
import backend.config as config

client = OpenAI(api_key=config.OPENAI_API_KEY)

SYSTEM_PROMPT = """
You are a healthcare assistant for a hospital.

Rules:
- Provide safe and responsible health information.
- Never encourage dangerous behavior.
- Stay professional.
"""

def call_llm(user_prompt):

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ]
    )

    return completion.choices[0].message.content