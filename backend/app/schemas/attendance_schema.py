"""
schemas/attendance_schema.py

Pydantic v2 models for Attendance request validation and response serialization.

Frontend calls GET /attendance/{employee_id} and expects:
  {
    employee_id: str,
    total_present: int,
    total_absent: int,
    records: [{ id, employee_id, date, status }, ...]
  }

Frontend calls POST /attendance/ with:
  { employee_id, date (YYYY-MM-DD), status ("Present"|"Absent") }
"""

from __future__ import annotations
from typing import Literal
from pydantic import BaseModel, field_validator
import re


# ---------------------------------------------------------------------------
# Request
# ---------------------------------------------------------------------------

class AttendanceCreate(BaseModel):
    employee_id: str
    date: str                           # YYYY-MM-DD
    status: Literal["Present", "Absent"]

    @field_validator("employee_id")
    @classmethod
    def validate_employee_id(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("employee_id cannot be empty.")
        return v

    @field_validator("date")
    @classmethod
    def validate_date(cls, v: str) -> str:
        v = v.strip()
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", v):
            raise ValueError("date must be in YYYY-MM-DD format.")
        return v


# ---------------------------------------------------------------------------
# Single record response
# ---------------------------------------------------------------------------

class AttendanceRecord(BaseModel):
    id: str
    employee_id: str
    date: str
    status: str


# ---------------------------------------------------------------------------
# Summary response  (GET /attendance/{employee_id})
# ---------------------------------------------------------------------------

class AttendanceSummary(BaseModel):
    employee_id: str
    total_present: int
    total_absent: int
    records: list[AttendanceRecord]
