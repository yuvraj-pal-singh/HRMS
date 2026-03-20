# HRMS — Full-Stack Human Resource Management System

This project is developed as part of a **Full-Stack Coding Assignment** to demonstrate end-to-end development skills including frontend, backend, database design, and deployment.

---

# 🌐 Live Application

### 🔗 Frontend (Vercel)

https://hrms-rho-one.vercel.app/

### 🔗 Backend API (Render)

https://hrms-8615.onrender.com

### 📄 API Documentation

https://hrms-8615.onrender.com/docs

---

# ⚠️ Important Note

The backend is deployed on **Render free tier**, which may go to sleep after inactivity.

- First request may take **30–50 seconds**
- Subsequent requests will be fast

---

# 📌 Project Overview

HRMS Lite is a lightweight Human Resource Management System that allows an admin to:

- 👨‍💼 Manage employee records
- 🕒 Track employee attendance
- 📊 View dashboard statistics

The system is designed with a **clean UI**, **modular backend**, and **production-ready structure**.

---

# ✅ Features Implemented

## 1. Employee Management

- Add employee (ID, Name, Email, Department)
- View all employees
- Delete employee
- Duplicate employee validation

## 2. Attendance Management

- Mark attendance (Present / Absent)
- View attendance per employee
- Prevent duplicate attendance for same date

## 3. Dashboard (Bonus ✅)

- Total employees count
- Attendance summary

---

# 🛠️ Tech Stack

| Layer      | Technology         |
| ---------- | ------------------ |
| Frontend   | React, Vite, Axios |
| Backend    | FastAPI, Python    |
| Database   | MongoDB Atlas      |
| Deployment | Vercel + Render    |

---

# 🏗️ Architecture

The project follows a **layered architecture**:

- Routes → API endpoints
- Services → Business logic
- Models → Data transformation
- Database → MongoDB connection

backend/
└── app/
├── main.py
├── routes/
├── services/
├── models/
├── schemas/
└── utils/

---

# 🔌 API Endpoints

| Method | Endpoint                    | Description     |
| ------ | --------------------------- | --------------- |
| GET    | `/`                         | Health check    |
| GET    | `/dashboard`                | Dashboard stats |
| POST   | `/employees`                | Create employee |
| GET    | `/employees`                | List employees  |
| DELETE | `/employees/{id}`           | Delete employee |
| POST   | `/attendance`               | Mark attendance |
| GET    | `/attendance/{employee_id}` | Get attendance  |

---

# 💻 Local Setup

## 📌 Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB Atlas

---

## ⚙️ Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

pip install -r requirements.txt
Create .env file
MONGO_URI=your_mongodb_connection_string
DB_NAME=hrms_lite
Run Backend
uvicorn app.main:app --reload --port 8000

👉 http://localhost:8000

👉 http://localhost:8000/docs

⚛️ Frontend Setup
cd frontend
npm install
Create .env
VITE_API_URL=http://localhost:8000
Run Frontend
npm run dev

👉 http://localhost:5173

🚀 Deployment
Backend (Render)

Root Directory: backend

Build Command:

pip install -r requirements.txt

Start Command:

gunicorn -k uvicorn.workers.UvicornWorker app.main:app
Environment Variables
MONGO_URI = your MongoDB connection string
DB_NAME   = hrms_lite
Frontend (Vercel)

Framework: Vite

Environment Variable
VITE_API_URL=https://hrms-8615.onrender.com
🧠 Assumptions

Single admin (no authentication required)

Employee ID is unique

Attendance is limited to one entry per day per employee

Dates follow ISO format (YYYY-MM-DD)

⚠️ Limitations

No authentication/authorization

No pagination for large datasets

No role-based access
```
