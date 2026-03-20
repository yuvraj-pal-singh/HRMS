import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./hooks/useToast";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";

function NotFound() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      height: "60vh", gap: 12, fontFamily: "var(--font-mono)",
    }}>
      <div style={{ fontSize: 64, fontWeight: 800, color: "var(--border2)" }}>404</div>
      <div style={{ color: "var(--text3)", fontSize: 14 }}>Page not found</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </ToastProvider>
    </BrowserRouter>
  );
}
