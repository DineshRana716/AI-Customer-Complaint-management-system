from typing import Optional

from pydantic import BaseModel, Field, field_validator


class ComplaintExtractRequest(BaseModel):
    complaint_text: str = Field(..., description="Raw complaint text to extract from")

    @field_validator("complaint_text")
    @classmethod
    def complaint_text_must_not_be_blank(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("complaint_text must not be empty")
        return value.strip()


class StructuredComplaint(BaseModel):
    customer_name: Optional[str] = None
    product_name: Optional[str] = None
    strength: Optional[str] = None
    batch_number: Optional[str] = None
    affected_quantity: Optional[str] = None
    manufacturing_date: Optional[str] = None
    expiry_date: Optional[str] = None
    originating_site: Optional[str] = None
    complaint_category: Optional[str] = None
    complaint_description: Optional[str] = None

    @field_validator("affected_quantity", mode="before")
    @classmethod
    def convert_quantity_to_string(cls, value):
        if value is None:
            return None
        return str(value)