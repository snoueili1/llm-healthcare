import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Read environment variables safely
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
LAKERA_API_KEY = os.environ.get("LAKERA_API_KEY")

# Debug print to confirm loading
print("OPENAI KEY LOADED:", OPENAI_API_KEY is not None)
print("LAKERA KEY LOADED:", LAKERA_API_KEY is not None)