import json
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app import app
from schemas.complaint import StructuredComplaint
from services.groq_extract import GroqExtractionError

client = TestClient(app)

SAMPLE_TEXT = (
    "Apollo Pharmacy reported that 20 Amoxicillin 500 mg capsules "
    "from batch AMX240602 were discolored."
)

VALID_AI_PAYLOAD = {
    "customer_name": "Apollo Pharmacy",
    "product_name": "Amoxicillin",
    "strength": "500 mg",
    "batch_number": "AMX240602",
    "affected_quantity": "20 capsules",
    "manufacturing_date": None,
    "expiry_date": None,
    "originating_site": None,
    "complaint_category": "Discoloration",
    "complaint_description": (
        "Apollo Pharmacy reported that 20 Amoxicillin 500 mg capsules "
        "from batch AMX240602 were discolored."
    ),
}


def test_extract_success():
    mock_result = StructuredComplaint.model_validate(VALID_AI_PAYLOAD)

    with patch(
        "routers.complaints.extract_structured_complaint",
        return_value=mock_result,
    ) as mock_extract:
        response = client.post(
            "/api/complaints/extract",
            json={"complaint_text": SAMPLE_TEXT},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["customer_name"] == "Apollo Pharmacy"
    assert body["product_name"] == "Amoxicillin"
    assert body["strength"] == "500 mg"
    assert body["batch_number"] == "AMX240602"
    assert body["manufacturing_date"] is None
    assert body["originating_site"] is None
    mock_extract.assert_called_once_with(SAMPLE_TEXT)


def test_extract_empty_complaint_text():
    response = client.post(
        "/api/complaints/extract",
        json={"complaint_text": "   "},
    )
    assert response.status_code == 422


def test_extract_missing_complaint_text():
    response = client.post("/api/complaints/extract", json={})
    assert response.status_code == 422


def test_extract_groq_failure():
    with patch(
        "routers.complaints.extract_structured_complaint",
        side_effect=GroqExtractionError("Groq API request failed"),
    ):
        response = client.post(
            "/api/complaints/extract",
            json={"complaint_text": SAMPLE_TEXT},
        )

    assert response.status_code == 502
    assert "Groq API request failed" in response.json()["detail"]


def test_extract_invalid_ai_output():
    with patch(
        "routers.complaints.extract_structured_complaint",
        side_effect=GroqExtractionError("AI response was not valid JSON"),
    ):
        response = client.post(
            "/api/complaints/extract",
            json={"complaint_text": SAMPLE_TEXT},
        )

    assert response.status_code == 502
    assert "valid JSON" in response.json()["detail"]


def test_health_unchanged():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@patch("services.groq_extract.Groq")
def test_service_parses_valid_groq_json(mock_groq_cls):
    from services.groq_extract import extract_structured_complaint

    mock_client = MagicMock()
    mock_groq_cls.return_value = mock_client
    mock_client.chat.completions.create.return_value = MagicMock(
        choices=[
            MagicMock(
                message=MagicMock(content=json.dumps(VALID_AI_PAYLOAD)),
            )
        ]
    )

    with patch.dict("os.environ", {"GROQ_API_KEY": "test-key"}):
        result = extract_structured_complaint(SAMPLE_TEXT)

    assert result.customer_name == "Apollo Pharmacy"
    assert result.batch_number == "AMX240602"
    assert result.expiry_date is None


@patch("services.groq_extract.Groq")
def test_service_rejects_invalid_json(mock_groq_cls):
    from services.groq_extract import extract_structured_complaint

    mock_client = MagicMock()
    mock_groq_cls.return_value = mock_client
    mock_client.chat.completions.create.return_value = MagicMock(
        choices=[MagicMock(message=MagicMock(content="not-json"))]
    )

    with patch.dict("os.environ", {"GROQ_API_KEY": "test-key"}):
        with pytest.raises(GroqExtractionError, match="valid JSON"):
            extract_structured_complaint(SAMPLE_TEXT)
