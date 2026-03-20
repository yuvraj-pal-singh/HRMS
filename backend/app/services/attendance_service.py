"""
services/attendance_service.py

All attendance business logic lives here.
"""

from datetime import date as date_type
from fastapi import HTTPException, status
from app.database import get_db
from app.models.attendance_model import build_attendance_doc, serialize_attendance
from app.schemas.attendance_schema import AttendanceCreate


async def mark_attendance(data: AttendanceCreate) -> dict:
    """
    Record attendance for an employee on a given date.

    Raises:
        404  if employee_id does not exist
        409  if attendance is already marked for that employee+date
    """
    db = get_db()

    # Verify the employee exists
    employee = await db["employees"].find_one({"employee_id": data.employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{data.employee_id}' not found. Add the employee first.",
        )

    # One record per employee per day
    duplicate = await db["attendance"].find_one(
        {"employee_id": data.employee_id, "date": data.date}
    )
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Attendance for '{data.employee_id}' on {data.date} is already recorded.",
        )

    doc = build_attendance_doc(
        employee_id=data.employee_id,
        date=data.date,
        status=data.status,
    )
    result = await db["attendance"].insert_one(doc)
    created = await db["attendance"].find_one({"_id": result.inserted_id})
    return serialize_attendance(created)


async def get_attendance_by_employee(
    employee_id: str,
    date_filter: str | None = None,
) -> dict:
    """
    Return all attendance records for one employee.
    Optionally filter by a specific date (YYYY-MM-DD).

    Response shape:
        {
          employee_id, total_present, total_absent,
          records: [{ id, employee_id, date, status }, ...]
        }

    Raises:
        404  if employee_id does not exist
    """
    db = get_db()

    # Verify the employee exists
    employee = await db["employees"].find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{employee_id}' not found.",
        )

    query: dict = {"employee_id": employee_id}
    if date_filter:
        query["date"] = date_filter

    cursor = db["attendance"].find(query).sort("date", -1)
    records = [serialize_attendance(doc) async for doc in cursor]

    return {
        "employee_id": employee_id,
        "total_present": sum(1 for r in records if r["status"] == "Present"),
        "total_absent":  sum(1 for r in records if r["status"] == "Absent"),
        "records": records,
    }


async def count_attendance_records() -> int:
    """Total attendance records across all employees (dashboard stat)."""
    return await get_db()["attendance"].count_documents({})


async def count_present_today() -> int:
    """How many employees are marked Present for today (dashboard stat)."""
    today = date_type.today().isoformat()   # "YYYY-MM-DD"
    return await get_db()["attendance"].count_documents(
        {"date": today, "status": "Present"}
    )

async def count_absent_today() -> int:
    from datetime import date as date_type
    today = date_type.today().isoformat()
    return await get_db()["attendance"].count_documents(
        {"date": today, "status": "Absent"}
    )