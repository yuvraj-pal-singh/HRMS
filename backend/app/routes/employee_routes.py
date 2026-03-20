"""
routes/employee_routes.py

Thin HTTP layer — validation is handled by Pydantic schemas,
business logic lives in employee_service.
"""

from fastapi import APIRouter
from app.schemas.employee_schema import EmployeeCreate, EmployeeResponse
from app.services import employee_service

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.post(
    "/",
    response_model=EmployeeResponse,
    status_code=201,
    summary="Create a new employee",
)
async def add_employee(payload: EmployeeCreate):
    return await employee_service.create_employee(payload)


@router.get(
    "/",
    response_model=list[EmployeeResponse],
    summary="List all employees",
)
async def list_employees():
    return await employee_service.get_all_employees()


@router.delete(
    "/{employee_id}",
    summary="Delete an employee by their employee_id",
)
async def remove_employee(employee_id: str):
    return await employee_service.delete_employee(employee_id)
