"""
routes/attendance_routes.py

POST /attendance/                       — mark attendance
GET  /attendance/{employee_id}          — get records (+ optional ?date= filter)
"""

from typing import Optional
from fastapi import APIRouter, Query
from app.schemas.attendance_schema import AttendanceCreate, AttendanceRecord, AttendanceSummary
from app.services import attendance_service

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post(
    "/",
    response_model=AttendanceRecord,
    status_code=201,
    summary="Mark attendance for an employee",
)
async def mark_attendance(payload: AttendanceCreate):
    return await attendance_service.mark_attendance(payload)


@router.get(
    "/{employee_id}",
    response_model=AttendanceSummary,
    summary="Get attendance records for an employee",
)
async def get_attendance(
    employee_id: str,
    date: Optional[str] = Query(
        None,
        description="Filter by specific date in YYYY-MM-DD format",
        example="2026-03-12",
    ),
):
    return await attendance_service.get_attendance_by_employee(employee_id, date)
