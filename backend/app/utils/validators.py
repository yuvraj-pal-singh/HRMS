"""
utils/validators.py

Shared validation helpers (used standalone when Pydantic isn't in scope).
"""

import re


def is_valid_email(email: str) -> bool:
    return bool(re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email))


def is_valid_date(date_str: str) -> bool:
    """YYYY-MM-DD format check."""
    return bool(re.match(r"^\d{4}-\d{2}-\d{2}$", date_str))


def is_valid_employee_id(eid: str) -> bool:
    """Alphanumeric + hyphens/underscores only."""
    return bool(re.match(r"^[A-Za-z0-9_\-]+$", eid))
