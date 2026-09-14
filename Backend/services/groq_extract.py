import json
import os
import re
from typing import Any

from groq import Groq
from pydantic import ValidationError

from schemas.complaint import StructuredComplaint

GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")

EXTRACTION_SYSTEM_PROMPT = """You are a pharmaceutical complaint data extraction assistant.
Extract structured fields from the customer complaint text.
Return ONLY a single valid JSON object with exactly these keys:
customer_name, product_name, strength, batch_number, affected_quantity,
manufacturing_date, expiry_date, originating_site, complaint_category,
complaint_description.

Rules:
- Use null for any field not explicitly stated in the text.
- Do not invent, guess, or infer missing information.
- complaint_description should briefly restate only what the text says.
- complaint_category only if clearly supported by the text; otherwise null.
- Do not include markdown, code fences, or any text outside the JSON object.
"""


class GroqExtractionError(Exception):
    """Raised when Groq fails or returns unusable output."""


def _get_client() -> Groq:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise GroqExtractionError("GROQ_API_KEY is not configured")
    return Groq(api_key=api_key)


def _strip_code_fences(content: str) -> str:
    text = content.strip()
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if fence_match:
        return fence_match.group(1).strip()
    return text


def _parse_json_content(content: str) -> dict[str, Any]:
    cleaned = _strip_code_fences(content)
    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise GroqExtractionError("AI response was not valid JSON") from exc

    if not isinstance(data, dict):
        raise GroqExtractionError("AI response JSON must be an object")
    return data


def extract_structured_complaint(complaint_text: str) -> StructuredComplaint:
    """Call Groq and validate the response as StructuredComplaint."""
    try:
        client = _get_client()
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": EXTRACTION_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"Extract structured complaint JSON from this text:\n\n{complaint_text}",
                },
            ],
            temperature=0,
            response_format={"type": "json_object"},
        )
    except GroqExtractionError:
        raise
    except Exception as exc:
        raise GroqExtractionError(f"Groq API request failed: {exc}") from exc

    try:
        content = response.choices[0].message.content
    except (AttributeError, IndexError, TypeError) as exc:
        raise GroqExtractionError("Groq API returned an unexpected response shape") from exc

    if not content or not str(content).strip():
        raise GroqExtractionError("Groq API returned an empty response")

    data = _parse_json_content(str(content))

    try:
        return StructuredComplaint.model_validate(data)
    except ValidationError as exc:
        raise GroqExtractionError(f"AI output failed schema validation: {exc}") from exc
