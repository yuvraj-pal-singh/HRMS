"""
routes/dashboard_routes.py

GET /dashboard/stats  — aggregate metrics for the Dashboard page.

Response shape (matches what Dashboard.jsx reads):
  {
    total_employees:          int,
    present_today:            int,
    total_attendance_records: int
  }
"""

from fastapi import APIRouter
from app.services.employee_service import count_employees
from app.services.attendance_service import count_attendance_records, count_present_today ,count_absent_today

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", summary="Dashboard summary statistics")
async def get_dashboard_stats():
    total_employees, total_attendance, present_today ,absent_today = await _gather_stats()
    return {
        "total_employees":          total_employees,
        "present_today":            present_today,
        "absent_today":             absent_today,
        "total_attendance_records": total_attendance,
    }


async def _gather_stats():
    """Run the three count queries concurrently."""
    import asyncio
    return await asyncio.gather(
        count_employees(),
        count_attendance_records(),
        count_present_today(),
        count_absent_today(), 
    )
