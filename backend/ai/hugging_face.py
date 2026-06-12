import os
import base64
from io import BytesIO
from huggingface_hub import InferenceClient

HF_TOKEN = os.environ.get("HF_TOKEN")
MODEL_ID = "black-forest-labs/FLUX.1-schnell"


def _friendly_error(error: Exception) -> dict:
    """Convert raw HuggingFace exceptions into user-friendly messages."""

    err_str = str(error)

    if "429" in err_str:
        return {
            "success": False,
            "error": (
                "⏳ **Rate Limit Reached**\n\n"
                "Hugging Face free tier has a rate limit. "
                "Please wait a minute and try again."
            ),
        }
    elif "403" in err_str:
        return {
            "success": False,
            "error": (
                "🔑 **Permission Denied**\n\n"
                "Your Hugging Face token does not have permission to use the Serverless Inference API. "
                "Please create a new Fine-grained token with 'Make calls to the Serverless Inference API' checked."
            ),
        }
    elif "503" in err_str:
        return {
            "success": False,
            "error": (
                "😴 **Model is waking up**\n\n"
                "The AI model is currently loading into memory. "
                "Please wait about 20-30 seconds and try again!"
            ),
        }

    # Catch-all
    return {
        "success": False,
        "error": f"⚠️ **Image Generation Failed**\n\nSomething went wrong: {err_str}\n\nPlease try again with a different prompt.",
    }


async def generate_image(prompt: str) -> dict:
    """
    Generate an image using Hugging Face Serverless Inference API via InferenceClient.
    Returns a dict with 'success' and either 'image_base64' or 'error'.
    """
    if not HF_TOKEN:
        return {
            "success": False,
            "error": "🔑 **HF_TOKEN not set**\n\nPlease set the HF_TOKEN environment variable.",
        }

    if not prompt or not prompt.strip():
        return {
            "success": False,
            "error": "Please provide a prompt to generate an image.",
        }

    try:
        print(f"\n🎨 Generating image: '{prompt[:50]}...'")

        client = InferenceClient(token=HF_TOKEN)

        # text_to_image returns a PIL Image object
        # Note: Since this is blocking, in a real production app we'd use run_in_executor
        # but for this local app it's fine.
        image = client.text_to_image(prompt, model=MODEL_ID)

        # Convert PIL Image to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        image_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

        print("✅ Image generated successfully!")
        return {
            "success": True,
            "image_base64": image_base64,
            "prompt": prompt,
            "mime_type": "image/png",
        }

    except Exception as e:
        print(f"\n❌ HuggingFace Error: {str(e)}")
        return _friendly_error(e)
