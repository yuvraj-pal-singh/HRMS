const BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

function url(path) {
  if (!BASE) return path;
  return `${BASE}${path.startsWith("/") ? path : "/" + path}`;
}

async function req(path, options = {}) {
  const res = await fetch(url(path), {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data.detail || data.message || msg;
    } catch {}
    throw new Error(msg);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Health
  health: () => req("/health"),

  // Employees
  getEmployees: () => req("/employees/"),
  createEmployee: (data) => req("/employees/", { method: "POST", body: JSON.stringify(data) }),
  deleteEmployee: (id) => req(`/employees/${id}`, { method: "DELETE" }),

  // Attendance
  markAttendance: (data) => req("/attendance/", { method: "POST", body: JSON.stringify(data) }),
  getAttendance: (employeeId, date) => {
    const qs = date ? `?date=${date}` : "";
    return req(`/attendance/${employeeId}${qs}`);
  },

  // Dashboard
  getDashboardStats: () => req("/dashboard/stats"),
};
