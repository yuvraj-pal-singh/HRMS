import { useEffect, useState } from "react";
import { Plus, Trash2, Users, X, Loader } from "lucide-react";
import { api } from "../lib/api";
import { useToast } from "../hooks/useToast";

const DEPT_COLORS = {
  Engineering:  { bg: "rgba(59,130,246,.12)",  color: "#60a5fa",  border: "rgba(59,130,246,.2)" },
  Product:      { bg: "rgba(167,139,250,.12)", color: "#a78bfa",  border: "rgba(167,139,250,.2)" },
  Design:       { bg: "rgba(236,72,153,.12)",  color: "#f472b6",  border: "rgba(236,72,153,.2)" },
  "Data Science":{ bg: "rgba(245,158,11,.12)", color: "#fbbf24",  border: "rgba(245,158,11,.2)" },
  DevOps:       { bg: "rgba(34,197,94,.12)",   color: "#4ade80",  border: "rgba(34,197,94,.2)" },
  QA:           { bg: "rgba(239,68,68,.12)",   color: "#f87171",  border: "rgba(239,68,68,.2)" },
  "IT Support": { bg: "rgba(20,184,166,.12)",  color: "#2dd4bf",  border: "rgba(20,184,166,.2)" },
  HR:           { bg: "rgba(249,115,22,.12)",  color: "#fb923c",  border: "rgba(249,115,22,.2)" },
  Marketing:    { bg: "rgba(232,255,71,.1)",   color: "#e8ff47",  border: "rgba(232,255,71,.2)" },
  Sales:        { bg: "rgba(99,102,241,.12)",  color: "#818cf8",  border: "rgba(99,102,241,.2)" },
};

const AVATAR_COLORS = [
  { bg: "#1d3461", color: "#60a5fa" },
  { bg: "#1a2e1a", color: "#4ade80" },
  { bg: "#2d1b1b", color: "#f87171" },
  { bg: "#2d2b1a", color: "#fbbf24" },
  { bg: "#231a2d", color: "#a78bfa" },
  { bg: "#1a2d2b", color: "#2dd4bf" },
  { bg: "#2d1a25", color: "#f472b6" },
];

function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function deptBadge(dept) {
  const c = DEPT_COLORS[dept] || { bg: "var(--bg3)", color: "var(--text2)", border: "var(--border2)" };
  return (
    <span className="badge" style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      {dept}
    </span>
  );
}

const DEPTS = ["Engineering","Product","Design","Data Science","DevOps","QA","IT Support","HR","Marketing","Sales"];

const EMPTY_FORM = { employeeId: "", fullName: "", email: "", department: "" };

export default function Employees() {
  const toast = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // employee object
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchEmployees = () => {
    setLoading(true);
    api.getEmployees()
      .then(setEmployees)
      .catch(e => toast(e.message, "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEmployees(); }, []);

  function validate() {
    const e = {};
    if (!form.employeeId.trim()) e.employeeId = "Required";
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Invalid email";
    if (!form.department) e.department = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.createEmployee(form);
      toast("Employee added successfully", "success");
      setShowModal(false);
      setForm(EMPTY_FORM);
      setErrors({});
      fetchEmployees();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await api.deleteEmployee(confirmDelete.id || confirmDelete._id);
      toast(`${confirmDelete.fullName} removed`, "success");
      setConfirmDelete(null);
      fetchEmployees();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="page-header fade-up">
        <div>
          <h1 className="page-title">Team Members</h1>
          <p className="page-subtitle">
            {employees.length} {employees.length === 1 ? "employee" : "employees"} registered
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => { setForm(EMPTY_FORM); setErrors({}); setShowModal(true); }}>
            <Plus size={15} />
            Add Employee
          </button>
        </div>
      </div>

      <div className="table-wrap fade-up-1">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Contact</th>
              <th>Department</th>
              <th>Present Days</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "48px 0", color: "var(--text3)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    <div className="spinner" /> Loading employees…
                  </div>
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">
                    <div className="empty-icon"><Users size={22} style={{ color: "var(--text3)" }} /></div>
                    <div className="empty-title">No employees yet</div>
                    <div className="empty-sub">Add your first team member to get started.</div>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                      <Plus size={14} /> Add Employee
                    </button>
                  </div>
                </td>
              </tr>
            ) : employees.map(emp => {
              const av = avatarColor(emp.fullName);
              const pct = Math.min(100, ((emp.totalPresent || 0) / 30) * 100);
              return (
                <tr key={emp._id || emp.id}>
                  <td>
                    <div className="employee-cell">
                      <div className="avatar" style={{ background: av.bg, color: av.color }}>
                        {getInitials(emp.fullName)}
                      </div>
                      <div>
                        <div className="employee-name">{emp.fullName}</div>
                        <div className="employee-id">{emp.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--text2)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                    {emp.email}
                  </td>
                  <td>{deptBadge(emp.department)}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text2)", minWidth: 50 }}>
                        {emp.totalPresent || 0} days
                      </span>
                      <div className="prog-bar">
                        <div className="prog-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-icon btn-danger"
                      onClick={() => setConfirmDelete(emp)}
                      title="Delete employee"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">New Team Member</span>
              <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setShowModal(false)}>
                <X size={15} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">Employee ID *</label>
                    <input
                      className="input"
                      placeholder="EMP001"
                      value={form.employeeId}
                      onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))}
                    />
                    {errors.employeeId && <span style={{ color: "#f87171", fontSize: 11, fontFamily: "var(--font-mono)" }}>{errors.employeeId}</span>}
                  </div>

                  <div className="input-group">
                    <label className="input-label">Department *</label>
                    <select
                      className="select"
                      value={form.department}
                      onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                    >
                      <option value="">Select…</option>
                      {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.department && <span style={{ color: "#f87171", fontSize: 11, fontFamily: "var(--font-mono)" }}>{errors.department}</span>}
                  </div>

                  <div className="input-group form-grid-full">
                    <label className="input-label">Full Name *</label>
                    <input
                      className="input"
                      placeholder="Jane Smith"
                      value={form.fullName}
                      onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    />
                    {errors.fullName && <span style={{ color: "#f87171", fontSize: 11, fontFamily: "var(--font-mono)" }}>{errors.fullName}</span>}
                  </div>

                  <div className="input-group form-grid-full">
                    <label className="input-label">Email Address *</label>
                    <input
                      className="input"
                      type="email"
                      placeholder="jane@company.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                    {errors.email && <span style={{ color: "#f87171", fontSize: 11, fontFamily: "var(--font-mono)" }}>{errors.email}</span>}
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving…</> : <><Plus size={14} /> Create Employee</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setConfirmDelete(null)}>
          <div className="modal confirm-modal">
            <div className="modal-header">
              <span className="modal-title" style={{ color: "#f87171" }}>Delete Employee</span>
              <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setConfirmDelete(null)}>
                <X size={15} />
              </button>
            </div>
            <div className="modal-body">
              <div className="confirm-icon">
                <Trash2 size={20} style={{ color: "#f87171" }} />
              </div>
              <div className="confirm-title">Are you sure?</div>
              <div className="confirm-desc">
                This will permanently remove <strong style={{ color: "var(--text)" }}>{confirmDelete.fullName}</strong> and all their attendance records. This action cannot be undone.
              </div>
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                  {deleting ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Deleting…</> : <><Trash2 size={14} /> Delete</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
