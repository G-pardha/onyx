import os
from mistralai.client.sdk import Mistral

# Initialize Mistral client from environment variable
try:
    api_key = os.environ.get("MISTRAL_API_KEY")
    if api_key:
        client = Mistral(api_key=api_key)
    else:
        print("Warning: MISTRAL_API_KEY not set in environment variables.")
        client = None
except Exception as e:
    print(f"Error initializing Mistral client: {e}")
    client = None


def get_system_prompt():
    return (
        "Your name is Mistral. You are a sharp, analytical AI built by Mistral AI. "
        "You have a calm, precise, and slightly witty personality. "
        "You prioritize clarity and accuracy in every response."
    )


async def generate_response(
    messages: list, model: str = "mistral-small-latest", images: list = None
) -> str:
    if not client:
        return "System Error: Mistral client not initialized. Make sure MISTRAL_API_KEY is set."

    # Ensure system prompt is at the start
    if not messages or messages[0].get("role") != "system":
        messages.insert(0, {"role": "system", "content": get_system_prompt()})

    # If images are provided, convert the last user message to multimodal format
    if images:
        for i in range(len(messages) - 1, -1, -1):
            if messages[i].get("role") == "user":
                text_content = messages[i].get("content", "")
                # Build multimodal content array
                content_parts = []
                # Add images first
                for img in images:
                    content_parts.append(
                        {
                            "type": "image_url",
                            "image_url": f"data:{img['mime_type']};base64,{img['base64']}",
                        }
                    )
                # Add text
                content_parts.append({"type": "text", "text": text_content})
                messages[i]["content"] = content_parts
                break

    try:
        response = client.chat.complete(model=model, messages=messages)
        return response.choices[0].message.content
    except Exception as e:
        print(f"\nSystem Error (Mistral): {e}\n")
        return f"System Error: {str(e)}"
