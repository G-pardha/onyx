import os
import base64
from google import genai
from google.genai import types

# Initialize Gemini client from environment variable
try:
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        client = genai.Client(api_key=api_key)
    else:
        print("Warning: GEMINI_API_KEY not set in environment variables.")
        client = None
except Exception as e:
    print(f"Error initializing Gemini client: {e}")
    client = None


def get_system_prompt():
    return (
        "Your name is Gemini. You are a highly intelligent AI engineered by Google. "
        "You have a very friendly, helpful, and optimistic personality. "
        "Unlike Nexus, you always want to be polite and supportive to the user."
    )


async def generate_response(
    messages: list, model: str = "gemini-2.5-flash", images: list = None
) -> str:
    if not client:
        return "System Error: Gemini client not initialized. Make sure GEMINI_API_KEY is set."

    # Map generic messages to Gemini format
    gemini_messages = []
    system_instruction = None

    for msg in messages:
        role = msg.get("role")
        content = msg.get("content")

        if role == "system":
            system_instruction = content
        else:
            gemini_role = "user" if role == "user" else "model"
            gemini_messages.append(
                types.Content(
                    role=gemini_role, parts=[types.Part.from_text(text=content)]
                )
            )

    # If images are provided, add them to the last user message
    if images and gemini_messages:
        # Find the last user message and add image parts
        for i in range(len(gemini_messages) - 1, -1, -1):
            if gemini_messages[i].role == "user":
                image_parts = []
                for img in images:
                    image_bytes = base64.b64decode(img["base64"])
                    image_parts.append(
                        types.Part.from_bytes(
                            data=image_bytes, mime_type=img["mime_type"]
                        )
                    )
                # Rebuild the message with text + images
                existing_parts = list(gemini_messages[i].parts)
                gemini_messages[i] = types.Content(
                    role="user", parts=existing_parts + image_parts
                )
                break

    if not system_instruction:
        system_instruction = get_system_prompt()

    try:
        response = client.models.generate_content(
            model=model,
            contents=gemini_messages,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
            ),
        )
        return response.text
    except Exception as e:
        print(f"\nSystem Error (Gemini): {e}\n")
        return f"System Error: {str(e)}"
