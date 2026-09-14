from fastapi import APIRouter, HTTPException

from schemas.complaint import ComplaintExtractRequest, StructuredComplaint
from services.groq_extract import GroqExtractionError, extract_structured_complaint

router = APIRouter(prefix="/api/complaints", tags=["complaints"])


@router.post("/extract", response_model=StructuredComplaint)
def extract_complaint(payload: ComplaintExtractRequest) -> StructuredComplaint:
    try:
        return extract_structured_complaint(payload.complaint_text)
    except GroqExtractionError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
