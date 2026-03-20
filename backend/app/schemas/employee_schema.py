"""
schemas/employee_schema.py

Pydantic v2 models for Employee request validation and response serialization.

Frontend expects these response fields:
  id, employee_id, full_name, email, department, created_at
"""

from __future__ import annotations
from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator
import re


# ---------------------------------------------------------------------------
# Request
# ---------------------------------------------------------------------------

class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

    @field_validator("employee_id")
    @classmethod
    def validate_employee_id(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("employee_id cannot be empty.")
        if not re.match(r"^[A-Za-z0-9_\-]+$", v):
            raise ValueError(
                "employee_id may only contain letters, digits, hyphens, and underscores."
            )
        return v

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("full_name must be at least 2 characters.")
        return v

    @field_validator("department")
    @classmethod
    def validate_department(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("department cannot be empty.")
        return v


# ---------------------------------------------------------------------------
# Response  (what the frontend reads)
# ---------------------------------------------------------------------------

class EmployeeResponse(BaseModel):
    id: str
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: str | None = None
