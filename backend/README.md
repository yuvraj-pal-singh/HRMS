# HRMS Lite — Backend

FastAPI backend for the NEW ERA HR Workspace frontend.

## Tech Stack

- **Python 3.11+**
- **FastAPI** — async web framework
- **Motor** — async MongoDB driver
- **Pydantic v2** — request/response validation
- **MongoDB Atlas** — cloud database

## Project Structure

```
backend/
├── app/
│   ├── main.py               # App entry point, CORS, routers
│   ├── database.py           # Motor client + connect/close lifecycle
│   ├── models/
│   │   ├── employee_model.py # Document builder + serializer
│   │   └── attendance_model.py
│   ├── schemas/
│   │   ├── employee_schema.py  # Pydantic request/response models
│   │   └── attendance_schema.py
│   ├── routes/
│   │   ├── employee_routes.py   # POST /employees, GET /employees, DELETE /employees/{id}
│   │   ├── attendance_routes.py # POST /attendance, GET /attendance/{id}
│   │   └── dashboard_routes.py  # GET /dashboard/stats
│   ├── services/
│   │   ├── employee_service.py  # All employee business logic
│   │   └── attendance_service.py
│   └── utils/
│       └── validators.py
├── requirements.txt
├── .env
└── .env.example
```

## API Endpoints

| Method | Path                        | Description                           |
| ------ | --------------------------- | ------------------------------------- |
| GET    | `/`                         | Health check                          |
| GET    | `/health`                   | Health check                          |
| POST   | `/employees/`               | Create employee                       |
| GET    | `/employees/`               | List all employees                    |
| DELETE | `/employees/{employee_id}`  | Delete employee                       |
| POST   | `/attendance/`              | Mark attendance                       |
| GET    | `/attendance/{employee_id}` | Get attendance (+ `?date=YYYY-MM-DD`) |
| GET    | `/dashboard/stats`          | Dashboard statistics                  |

## Local Setup

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env and set your MONGO_URI

# 4. Start the server
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Deploy on Render

1. Push this folder to a GitHub repo
2. Create a **Web Service** on Render
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `MONGO_URI` = your Atlas connection string
   - `DB_NAME` = `hrms_lite`
