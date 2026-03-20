"""
models/employee_model.py

Helpers for building MongoDB documents and serializing them back
to the dict shape that Pydantic EmployeeResponse expects.
"""

from datetime import datetime, timezone
from bson import ObjectId


def build_employee_doc(
    employee_id: str,
    full_name: str,
    email: str,
    department: str,
) -> dict:
    """Return a MongoDB-ready employee document."""
    return {
        "employee_id": employee_id,
        "full_name": full_name,
        "email": email.lower().strip(),
        "department": department,
        "created_at": datetime.now(timezone.utc),
    }


def serialize_employee(doc: dict) -> dict:
    """Convert a raw MongoDB document → JSON-safe dict for the frontend."""
    created = doc.get("created_at")
    return {
        "id": str(doc["_id"]),
        "employee_id": doc["employee_id"],
        "full_name": doc["full_name"],
        "email": doc["email"],
        "department": doc["department"],
        "created_at": created.isoformat() if isinstance(created, datetime) else None,
    }
