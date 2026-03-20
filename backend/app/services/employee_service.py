"""
services/employee_service.py

All employee business logic lives here.
Routes call these functions; they never touch the DB directly.
"""

from fastapi import HTTPException, status
from app.database import get_db
from app.models.employee_model import build_employee_doc, serialize_employee
from app.schemas.employee_schema import EmployeeCreate


async def create_employee(data: EmployeeCreate) -> dict:
    """
    Insert a new employee.

    Raises:
        409  if employee_id is already taken
        409  if email is already registered
    """
    db = get_db()
    col = db["employees"]

    # Duplicate employee_id guard
    if await col.find_one({"employee_id": data.employee_id}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Employee ID '{data.employee_id}' is already in use.",
        )

    # Duplicate email guard (case-insensitive)
    if await col.find_one({"email": data.email.lower().strip()}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Email '{data.email}' is already registered.",
        )

    doc = build_employee_doc(
        employee_id=data.employee_id,
        full_name=data.full_name,
        email=data.email,
        department=data.department,
    )
    result = await col.insert_one(doc)
    created = await col.find_one({"_id": result.inserted_id})
    return serialize_employee(created)


async def get_all_employees() -> list[dict]:
    """Return every employee, newest first."""
    db = get_db()
    cursor = db["employees"].find({}).sort("created_at", -1)
    return [serialize_employee(doc) async for doc in cursor]


async def delete_employee(employee_id: str) -> dict:
    """
    Delete an employee by their employee_id string.

    Raises:
        404  if not found
    """
    db = get_db()
    col = db["employees"]

    existing = await col.find_one({"employee_id": employee_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{employee_id}' not found.",
        )

    await col.delete_one({"employee_id": employee_id})
    return {"message": f"Employee '{employee_id}' deleted successfully."}


async def count_employees() -> int:
    """Return total employee count (used by the dashboard)."""
    return await get_db()["employees"].count_documents({})
