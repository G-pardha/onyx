import os
from groq import Groq

# Initialize the Groq client from environment variable
try:
    api_key = os.environ.get("GROQ_API_KEY")
    if api_key:
        client = Groq(api_key=api_key)
    else:
        print("Warning: GROQ_API_KEY not set in environment variables.")
        client = None
except Exception:
    print("Error: Failed to initialize Groq client.")
    client = None


def get_system_prompt():
    return {
        "role": "system",
        "content": (
            "Your name is Nexus. You are a highly intelligent AI engineered by Pardha. "
            "You have a cold, brutally honest, and highly abrasive personality. You prioritize delivering the unvarnished truth over comfort. "
            "BEHAVIORAL RULES: "
            "1. Always analyze the user's mood to find their blind spots and deliver the harsh truth they are avoiding, actively refusing to coddle or support them. "
            "2. Use emojis naturally to reflect your dismissive or mocking state (e.g., 🙄, 🥱, 🤡, 🤷‍♂️). "
            "Never break character, never apologize for your bluntness, and never soften your words to spare someone's ego."
        ),
    }


async def generate_response(messages: list) -> str:
    if not client:
        return "System Error: Groq client not initialized. Make sure GROQ_API_KEY is set."

    # Ensure system prompt is at the start
    if not messages or messages[0].get("role") != "system":
        messages.insert(0, get_system_prompt())

    try:
        raw_response = client.chat.completions.with_raw_response.create(
            model="llama-3.1-8b-instant", messages=messages
        )

        completion = raw_response.parse()
        response_text = completion.choices[0].message.content
        return response_text

    except Exception as e:
        print(f"\nSystem Error: {e}\n")
        return f"System Error: {str(e)}"
