import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CalendarCheck, Zap } from "lucide-react";
import { format } from "date-fns";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
];

const titles = {
  "/": "overview",
  "/employees": "team / members",
  "/attendance": "attendance / log",
};

export default function Layout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">
            <div className="logo-box">
              <Zap size={16} />
            </div>
            <div>
              <div className="logo-name">HRMS</div>
              <div className="logo-sub">Workforce Console</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">Navigation</div>
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          API Connected
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <span className="topbar-title">
            {titles[pathname] || pathname.replace("/", "")}
          </span>
          <span className="topbar-date">
            {format(new Date(), "EEE, dd MMM yyyy")}
          </span>
        </header>
        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}
