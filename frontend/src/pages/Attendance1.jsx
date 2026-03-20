import { useEffect, useState } from "react";
import { CalendarCheck, Search, X, CheckCircle, XCircle, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";
import { api } from "../lib/api";
import { useToast } from "../hooks/useToast";

function getInitials(name) {
  return (name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

const AVATAR_BG = ["#1d3461","#1a2e1a","#2d1b1b","#2d2b1a","#231a2d","#1a2d2b"];
const AVATAR_FG = ["#60a5fa","#4ade80","#f87171","#fbbf24","#a78bfa","#2dd4bf"];

function avatarStyle(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  const i = Math.abs(h) % AVATAR_BG.length;
  return { background: AVATAR_BG[i], color: AVATAR_FG[i] };
}

const EMPTY_FORM = { employeeId: "", date: format(new Date(), "yyyy-MM-dd"), status: "Present" };

export default function Attendance() {
  const toast = useToast();
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState("");   // employee id for filtering
  const [dateFilter, setDateFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Load employees for the dropdown
  useEffect(() => {
    api.getEmployees().then(setEmployees).catch(() => {});
  }, []);

  // Load attendance whenever filter changes
  useEffect(() => {
    if (!selectedEmp) {
      setRecords([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api.getAttendance(selectedEmp, dateFilter || undefined)
      .then(setRecords)
      .catch(e => toast(e.message, "error"))
      .finally(() => setLoading(false));
  }, [selectedEmp, dateFilter]);

  function validate() {
    const e = {};
    if (!form.employeeId) e.employeeId = "Required";
    if (!form.date) e.date = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.markAttendance({
        employeeId: form.employeeId,
        date: form.date,
        status: form.status,
      });
      toast("Attendance marked successfully", "success");
      setShowModal(false);
      setForm(EMPTY_FORM);
      setErrors({});
      // Refresh if current filter matches
      if (selectedEmp && String(selectedEmp) === String(form.employeeId)) {
        api.getAttendance(selectedEmp, dateFilter || undefined).then(setRecords).catch(() => {});
      }
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  const sorted = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));

  const selectedEmpObj = employees.find(e => String(e._id || e.id) === String(selectedEmp));

  return (
    <>
      <div className="page-header fade-up">
        <div>
          <h1 className="page-title">Attendance Log</h1>
          <p className="page-subtitle">Track and manage employee attendance records.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => { setForm(EMPTY_FORM); setErrors({}); setShowModal(true); }}>
            <CalendarCheck size={15} />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar fade-up-1">
        <select
          className="select"
          style={{ maxWidth: 260 }}
          value={selectedEmp}
          onChange={e => setSelectedEmp(e.target.value)}
        >
          <option value="">Select employee to view records…</option>
          {employees.map(emp => (
            <option key={emp._id || emp.id} value={emp._id || emp.id}>
              {emp.fullName} ({emp.employeeId})
            </option>
          ))}
        </select>

        {selectedEmp && (
          <>
            <div style={{ position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" }} />
              <input
                type="date"
                className="input"
                style={{ paddingLeft: 30, maxWidth: 180 }}
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
              />
            </div>
            {dateFilter && (
              <div className="filter-chip">
                {format(parseISO(dateFilter), "MMM d, yyyy")}
                <button onClick={() => setDateFilter("")}><X size={11} /></button>
              </div>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedEmp(""); setDateFilter(""); }}>
              <X size={13} /> Clear
            </button>
          </>
        )}
      </div>

      <div className="table-wrap fade-up-2">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Recorded</th>
            </tr>
          </thead>
          <tbody>
            {!selectedEmp ? (
              <tr>
                <td colSpan={4}>
                  <div className="empty-state">
                    <div className="empty-icon"><Search size={22} style={{ color: "var(--text3)" }} /></div>
                    <div className="empty-title">Select an employee</div>
                    <div className="empty-sub">Choose an employee above to view their attendance records.</div>
                  </div>
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td colSpan={4}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "48px 0", color: "var(--text3)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    <div className="spinner" /> Loading records…
                  </div>
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="empty-state">
                    <div className="empty-icon"><CalendarCheck size={22} style={{ color: "var(--text3)" }} /></div>
                    <div className="empty-title">No records found</div>
                    <div className="empty-sub">
                      {dateFilter
                        ? `No attendance for ${format(parseISO(dateFilter), "MMMM d, yyyy")}`
                        : `${selectedEmpObj?.fullName || "This employee"} has no attendance records yet.`}
                    </div>
                    <button className="btn btn-primary" onClick={() => { setForm({ ...EMPTY_FORM, employeeId: selectedEmp }); setShowModal(true); }}>
                      <Plus size={14} /> Mark Attendance
                    </button>
                  </div>
                </td>
              </tr>
            ) : sorted.map(rec => {
              const isPresent = rec.status === "Present";
              const av = avatarStyle(rec.employeeName || selectedEmpObj?.fullName || "");
              return (
                <tr key={rec._id || rec.id}>
                  <td>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text2)" }}>
                      {format(parseISO(rec.date), "EEE, MMM d yyyy")}
                    </span>
                  </td>
                  <td>
                    <div className="employee-cell">
                      <div className="avatar" style={av}>
                        {getInitials(rec.employeeName || selectedEmpObj?.fullName || "?")}
                      </div>
                      <div>
                        <div className="employee-name">{rec.employeeName || selectedEmpObj?.fullName}</div>
                        <div className="employee-id">{rec.employeeIdCode || selectedEmpObj?.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {isPresent ? (
                      <span className="badge badge-green">
                        <CheckCircle size={11} /> Present
                      </span>
                    ) : (
                      <span className="badge badge-red">
                        <XCircle size={11} /> Absent
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text3)" }}>
                    {rec.createdAt ? format(new Date(rec.createdAt), "h:mm a") : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mark Attendance Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Mark Attendance</span>
              <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setShowModal(false)}>
                <X size={15} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="input-group form-grid-full">
                    <label className="input-label">Employee *</label>
                    <select
                      className="select"
                      value={form.employeeId}
                      onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))}
                    >
                      <option value="">Select employee…</option>
                      {employees.map(emp => (
                        <option key={emp._id || emp.id} value={emp._id || emp.id}>
                          {emp.fullName} — {emp.employeeId}
                        </option>
                      ))}
                    </select>
                    {errors.employeeId && <span style={{ color: "#f87171", fontSize: 11, fontFamily: "var(--font-mono)" }}>{errors.employeeId}</span>}
                  </div>

                  <div className="input-group">
                    <label className="input-label">Date *</label>
                    <input
                      type="date"
                      className="input"
                      value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    />
                    {errors.date && <span style={{ color: "#f87171", fontSize: 11, fontFamily: "var(--font-mono)" }}>{errors.date}</span>}
                  </div>

                  <div className="input-group">
                    <label className="input-label">Status</label>
                    <select
                      className="select"
                      value={form.status}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting
                      ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving…</>
                      : <><CalendarCheck size={14} /> Save Record</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
