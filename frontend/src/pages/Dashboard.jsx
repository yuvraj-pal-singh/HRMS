import { useEffect, useState } from "react";
import { Users, UserCheck, UserX, CalendarDays, TrendingUp } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { api } from "../lib/api";

const COLORS = ["#22c55e", "#ef4444"];

function StatCard({ title, value, icon: Icon, color, iconBg, barPct, barColor, trend, delay }) {
  return (
    <div
      className={`stat-card fade-up`}
      style={{
        "--bar-color": barColor,
        "--bar-pct": `${barPct}%`,
        "--icon-bg": iconBg,
        animationDelay: delay,
      }}
    >
      <div className="stat-label">{title}</div>
      <div className="stat-icon" style={{ background: iconBg }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div className="stat-value">{value ?? "—"}</div>
      <div className="stat-trend">{trend}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg2)", border: "1px solid var(--border2)",
      borderRadius: 8, padding: "8px 12px", fontFamily: "var(--font-mono)", fontSize: 12,
    }}>
      <div style={{ color: "var(--text2)" }}>{payload[0].name}</div>
      <div style={{ color: "var(--text)", fontWeight: 700, fontSize: 18 }}>{payload[0].value}</div>
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getDashboardStats()
      .then(setStats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12 }}>
      <div className="spinner" />
      <span style={{ color: "var(--text3)", fontFamily: "var(--font-mono)", fontSize: 13 }}>Loading stats…</span>
    </div>
  );

  if (error) return (
    <div style={{ padding: 24, background: "rgba(239,68,68,.08)", borderRadius: 10, border: "1px solid rgba(239,68,68,.2)", color: "#f87171", fontFamily: "var(--font-mono)", fontSize: 13 }}>
      Failed to load dashboard: {error}
    </div>
  );
  const present = stats?.present_today ?? 0;
  const absent = stats?.absent_today ?? 0;
  const total = present + absent;
  const presentPct = total > 0 ? Math.round((present / total) * 100) : 0;
  const absentPct = 100 - presentPct;

  const pieData = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
  ];

  const barData = [
    { name: "Employees", value: stats?.total_employees ?? 0 },
    { name: "Records", value: stats?.total_attendance_records ?? 0 },
    { name: "Present", value: present },
    { name: "Absent", value: absent },
  ];

  const statCards = [
    {
      title: "Total Employees",
      value: stats?.total_employees ?? 0,
      icon: Users,
      color: "#60a5fa",
      iconBg: "rgba(59,130,246,.12)",
      barColor: "#3b82f6",
      barPct: 100,
      trend: "All registered staff",
    },
    {
      title: "Total Records",
      value: stats?.total_attendance_records ?? 0,
      icon: CalendarDays,
      color: "#a78bfa",
      iconBg: "rgba(167,139,250,.12)",
      barColor: "#8b5cf6",
      barPct: 100,
      trend: "Across all time",
    },
    {
      title: "Present Today",
      value: present,
      icon: UserCheck,
      color: "#4ade80",
      iconBg: "rgba(34,197,94,.12)",
      barColor: "#22c55e",
      barPct: presentPct,
      trend: `${presentPct}% attendance rate`,
    },
    {
      title: "Absent Today",
      value: absent,
      icon: UserX,
      color: "#f87171",
      iconBg: "rgba(239,68,68,.12)",
      barColor: "#ef4444",
      barPct: absentPct,
      trend: `${absentPct}% of today's total`,
    },
  ];

  return (
    <>
      <div className="page-header fade-up">
        <div>
          <h1 className="page-title">Good morning 👋</h1>
          <p className="page-subtitle">Here's what's happening with your workforce today.</p>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((s, i) => (
          <StatCard key={s.title} {...s} delay={`${i * 0.06}s`} />
        ))}
      </div>

      <div className="charts-row">
        {/* Pie */}
        <div className="card fade-up-2">
          <div className="card-header">
            <div>
              <div className="section-title">Today's Attendance</div>
              <div className="section-sub">Present vs Absent distribution</div>
            </div>
          </div>
          <div className="card-body" style={{ height: 260 }}>
            {total === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text3)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
                No attendance marked today
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {total > 0 && (
            <div style={{ display: "flex", gap: 20, padding: "0 20px 18px", borderTop: "1px solid var(--border)" }}>
              {pieData.map((d, i) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[i], display: "inline-block" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text2)" }}>
                    {d.name} <strong style={{ color: "var(--text)" }}>{d.value}</strong>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bar overview */}
        <div className="card fade-up-3">
          <div className="card-header">
            <div>
              <div className="section-title">Overview</div>
              <div className="section-sub">System-wide summary</div>
            </div>
            <TrendingUp size={16} style={{ color: "var(--text3)", marginTop: 2 }} />
          </div>
          <div className="card-body" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={28}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--text3)" }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--text3)" }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,.03)" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="var(--accent)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick stats footer */}
      <div className="card fade-up-4">
        <div className="card-body" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
          {[
            { label: "Attendance Rate", value: `${presentPct}%`, color: presentPct > 70 ? "var(--green)" : "var(--amber)" },
            { label: "Total Staff", value: stats?.total_employees ?? 0, color: "var(--blue)" },
            { label: "All-time Records", value: stats?.total_attendance_records ?? 0, color: "var(--text)" },
          ].map((item, i) => (
            <div
              key={item.label}
              style={{
                padding: "16px 20px",
                borderRight: i < 2 ? "1px solid var(--border)" : "none",
                textAlign: "center",
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color, letterSpacing: "-1px" }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
