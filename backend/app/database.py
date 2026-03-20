"""
database.py — MongoDB Atlas connection via Motor (async driver).
The client is created once at startup and reused across all requests.
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI: str = os.getenv("MONGO_URI",)
DB_NAME: str = os.getenv("DB_NAME", "hrms_lite")

_client: AsyncIOMotorClient | None = None


async def connect_db() -> None:
    """Open the MongoDB connection and verify it with a ping."""
    global _client
    _client = AsyncIOMotorClient(MONGO_URI)
    await _client.admin.command("ping")
    print(f"[DB] Connected to MongoDB Atlas  →  database: '{DB_NAME}'")


async def close_db() -> None:
    """Close the MongoDB connection gracefully."""
    global _client
    if _client:
        _client.close()
        print("[DB] Connection closed.")


def get_db():
    """Return the active database handle.  Call after connect_db()."""
    if _client is None:
        raise RuntimeError("Database is not connected. Call connect_db() first.")
    return _client[DB_NAME]
