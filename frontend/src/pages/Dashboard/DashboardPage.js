import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig"; // <-- đảm bảo đường dẫn đúng
import "./Dashboard.css"; 


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
  console.log("🔍 Dashboard component rendered");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🧩 Gọi API để lấy dữ liệu thống kê
  useEffect(() => {
    console.log("🚀 useEffect Dashboard chạy");
    const fetchData = async () => {
      setLoading(true);
      console.log("Dashboard: bắt đầu fetchData");
      try {
        const endpoints = [
          "/pigs",
          "/pens",
          "/areas",
          "/staffs",
          "/foods",
          "/medicines",
          "/assignments",
          "/inject-medicines",
        ];

        const requests = endpoints.map((ep) => api.get(ep));
        const results = await Promise.allSettled(requests);

        results.forEach((r, idx) => {
          if (r.status === "fulfilled") {
            console.log(`Dashboard: ${endpoints[idx]} ->`, r.value.data);
          } else {
            console.warn(`Dashboard: ${endpoints[idx]} failed ->`, r.reason?.response?.data || r.reason?.message || r.reason);
          }
        });

        const getCount = (res) => {
          if (!res || res.status !== "fulfilled") return 0;
          const d = res.value.data;
          return Array.isArray(d) ? d.length : (Number(d?.total) || Number(d?.count) || 0);
        };

        setStats({
          pigs: getCount(results[0]),
          pens: getCount(results[1]),
          areas: getCount(results[2]),
          staffs: getCount(results[3]),
          foods: getCount(results[4]),
          medicines: getCount(results[5]),
          assignment: getCount(results[6]),
          injects: getCount(results[7]),
        });
      } catch (err) {
        console.error("Dashboard unexpected error:", err);
      } finally {
        setLoading(false);
        console.log("Dashboard: fetchData finished");
      }
    };

    fetchData();
  }, []);

  if (loading) return <h3>Đang tải dữ liệu...</h3>;

  return (
    
    <div style={{ padding: "30px" }} >
      <h2>📊 Bảng điều khiển quản lý trang trại</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {/* 🐖 Heo */}
        <div
          className="card"
          style={cardStyle}
          onClick={() => navigate("/pigs")}
        >
          <h3>🐖 Heo</h3>
          <p>{stats.pigs}</p>
        </div>

        {/* 🏠 Chuồng */}
        <div
          className="card"
          style={cardStyle}
          onClick={() => navigate("/pens")}
        >
          <h3>🏠 Chuồng</h3>
          <p>{stats.pens}</p>
        </div>

        {/* 🌾 Khu vực */}
        <div
          className="card"
          style={cardStyle}
          onClick={() => navigate("/areas")}
        >
          <h3>🌾 Khu vực</h3>
          <p>{stats.areas}</p>
        </div>

        {/* 👨‍🌾 Nhân viên */}
        <div
          className="card"
          style={cardStyle}
          onClick={() => navigate("/staffs")}
        >
          <h3>👨‍🌾 Nhân viên</h3>
          <p>{stats.staffs}</p>
        </div>

        {/* 🍽️ Thức ăn */}
        <div
          className="card"
          style={cardStyle}
          onClick={() => navigate("/foods")}
        >
          <h3>🍽️ Thức ăn</h3>
          <p>{stats.foods}</p>
        </div>

        {/* 💊 Thuốc */}
        <div
          className="card"
          style={cardStyle}
          onClick={() => navigate("/medicines")}
        >
          <h3>💊 Thuốc</h3>
          <p>{stats.medicines}</p>
        </div>
        
        {/* phan cong */}
        <div
          className="card"
          style={cardStyle}
          onClick={() => navigate("/assignments")}
        >
          <h3>📋  Phân công</h3>
          <p>{stats.assignment}</p>
        </div>

        {/* tiem thuoc */}
        <div
          className="card"
          style={cardStyle}
          onClick={() => navigate("/inject-medicines")}
        >
          <h3>💉  Tiêm thuốc</h3>
          <p>{stats.injects}</p>
        </div>
      </div>
    </div>
  );
};

// 🎨 Style thẻ thống kê
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
