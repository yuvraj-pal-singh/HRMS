"""
models/attendance_model.py

Helpers for building MongoDB documents and serializing them back
to the dict shape that Pydantic AttendanceRecord expects.
"""


def build_attendance_doc(employee_id: str, date: str, status: str) -> dict:
    """Return a MongoDB-ready attendance document."""
    return {
        "employee_id": employee_id,
        "date": date,       # stored as "YYYY-MM-DD" string
        "status": status,   # "Present" | "Absent"
    }


def serialize_attendance(doc: dict) -> dict:
    """Convert a raw MongoDB document → JSON-safe dict for the frontend."""
    return {
        "id": str(doc["_id"]),
        "employee_id": doc["employee_id"],
        "date": doc["date"],
        "status": doc["status"],
    }
