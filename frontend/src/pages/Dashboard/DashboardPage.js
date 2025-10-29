import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "./Dashboard.css";

const getRoleFromStorage = () => {
  try {
    const raw = localStorage.getItem("user");
    if (raw && raw !== "undefined" && raw !== "null") {
      const u = JSON.parse(raw);
      const r = Number(u.chuc_vu ?? u.vai_tro ?? u.role ?? u.role_id);
      if (!Number.isNaN(r)) return r;
    }
  } catch (err) {
    console.warn("Dashboard: parse user error", err);
  }

  const token = localStorage.getItem("token");
  if (token && token !== "undefined" && token !== "null") {
    try {
      const payload = token.split(".")[1];
      if (payload) {
        const json = JSON.parse(atob(payload));
        const r = Number(json.chuc_vu ?? json.vai_tro ?? json.role ?? json.role_id);
        if (!Number.isNaN(r)) return r;
      }
    } catch (err) {
      console.warn("Dashboard: decode token error", err);
    }
  }
  return null;
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    pigs: 0,
    pens: 0,
    areas: 0,
    staffs: 0,
    foods: 0,
    medicines: 0,
    assignment: 0,
    injects: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // role ids must match App.js
  const ROLE_FARM_MANAGER = 1;
  const ROLE_ASSISTANT_FARM_MANAGER = 2;
  const ROLE_WORKER = 3;
  const ROLE_ENGINEER = 4;

  // sections + allowed roles + backend endpoint
  const sections = [
    { key: "pigs", title: "🐖 Heo", to: "/pigs", allowed: [ROLE_FARM_MANAGER, ROLE_ASSISTANT_FARM_MANAGER, ROLE_WORKER], endpoint: "/pigs" },
    { key: "pens", title: "🏠 Chuồng", to: "/pens", allowed: [ROLE_FARM_MANAGER, ROLE_ASSISTANT_FARM_MANAGER], endpoint: "/pens" },
    { key: "areas", title: "🌾 Khu vực", to: "/areas", allowed: [ROLE_FARM_MANAGER], endpoint: "/areas" },
    { key: "staffs", title: "👨‍🌾 Nhân viên", to: "/staffs", allowed: [ROLE_FARM_MANAGER, ROLE_ASSISTANT_FARM_MANAGER], endpoint: "/staffs" },
    { key: "foods", title: "🍽️ Thức ăn", to: "/foods", allowed: [ROLE_FARM_MANAGER, ROLE_ASSISTANT_FARM_MANAGER], endpoint: "/foods" },
    { key: "medicines", title: "💊 Thuốc", to: "/medicines", allowed: [ROLE_FARM_MANAGER, ROLE_ASSISTANT_FARM_MANAGER], endpoint: "/medicines" },
    { key: "assignment", title: "📋 Phân công", to: "/assignments", allowed: [ROLE_FARM_MANAGER, ROLE_ASSISTANT_FARM_MANAGER, ROLE_WORKER], endpoint: "/assignments" },
    // try primary endpoint; backend may use /inject-medicines or /injects
    { key: "injects", title: "💉 Tiêm thuốc", to: "/inject-medicines", allowed: [ROLE_FARM_MANAGER, ROLE_ASSISTANT_FARM_MANAGER, ROLE_ENGINEER], endpoint: "/inject-medicines" },
  ];

  const role = getRoleFromStorage();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // determine which endpoints to call based on role (only fetch allowed ones)
        const allowedSections = sections.filter((s) => role !== null && s.allowed.map(Number).includes(Number(role)));
        const endpoints = allowedSections.map((s) => s.endpoint);

        // if none allowed, still stop loading
        if (endpoints.length === 0) {
          setLoading(false);
          return;
        }

        // build requests
        const requests = endpoints.map((ep) => api.get(ep));
        const results = await Promise.allSettled(requests);

        // populate a newStats starting from zeros
        const newStats = { ...stats };
        results.forEach((r, idx) => {
          const sec = allowedSections[idx];
          if (!sec) return;
          if (r.status === "fulfilled") {
            const d = r.value.data;
            const count = Array.isArray(d) ? d.length : Number(d?.total ?? d?.count) || 0;
            newStats[sec.key] = count;
          } else {
            // keep zero if failed; log for debug
            console.warn(`Dashboard fetch failed for ${sec.endpoint}:`, r.reason?.response?.data || r.reason?.message || r.reason);
            newStats[sec.key] = 0;
          }
        });

        // ensure other keys set to 0
        sections.forEach((s) => {
          if (!(s.key in newStats)) newStats[s.key] = 0;
        });

        setStats(newStats);
      } catch (err) {
        console.error("Dashboard unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]); // re-run when role changes

  if (loading) return <h3>Đang tải dữ liệu...</h3>;

  // if role not known, show message and ask to re-login
  if (role === null) {
    return (
      <div style={{ padding: 30 }}>
        <h2>📊 Bảng điều khiển quản lý trang trại</h2>
        <p>Bạn chưa đăng nhập hoặc quyền chưa được xác định. Vui lòng đăng nhập lại.</p>
      </div>
    );
  }

  const currentRole = Number(role);

  const visibleSections = sections.filter((s) => s.allowed.map(Number).includes(currentRole));

  return (
    <div style={{ padding: "30px" }}>
      <h2>📊 Bảng điều khiển quản lý trang trại</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {visibleSections.map((s) => (
          <div key={s.key} className="card" style={cardStyle} onClick={() => navigate(s.to)}>
            <h3>{s.title}</h3>
            <p>{stats[s.key]}</p>
          </div>
        ))}

        {visibleSections.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            <p>Bạn không có quyền xem mục nào trên dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const cardStyle = {
  background: "#fff",
  padding: "20px",
  textAlign: "center",
  borderRadius: "12px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
};

export default Dashboard;
