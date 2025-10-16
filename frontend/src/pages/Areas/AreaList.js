import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/table.css";
import "../../styles/form.css";

const AreaList = () => {
  const [areas, setAreas] = useState([]);
  const navigate = useNavigate();

  // 🟢 Lấy danh sách khu trại
  const fetchAreas = async () => {
    try {
      const res = await api.get("/areas");
      setAreas(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách khu trại:", err);
      alert("Không thể tải danh sách khu trại!");
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  // 🗑️ Xóa khu trại
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khu trại này không?")) {
      try {
        await api.delete(`/areas/${id}`);
        alert("✅ Xóa khu trại thành công!");
        fetchAreas();
      } catch (err) {
        console.error("❌ Lỗi khi xóa khu trại:", err);
        alert("Không thể xóa khu trại!");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách khu trại</h2>
      <button onClick={() => navigate("/areas/add")}>+ Thêm khu trại mới</button>

      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "15px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên khu</th>
            <th>Diện tích (m²)</th>
            <th>Ghi chú</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {areas.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Chưa có khu trại nào.
              </td>
            </tr>
          ) : (
            areas.map((area) => (
              <tr key={area.id}>
                <td>{area.id}</td>
                <td>{area.ten_khu}</td>
                <td>{area.dien_tich || "—"}</td>
                <td>{area.ghi_chu || "—"}</td>
                <td>
                  <button onClick={() => navigate(`/areas/edit/${area.id}`)} className="btn-edit">✏️ Sửa</button>
                  <button
                    onClick={() => handleDelete(area.id)}
                    className="btn-delete"

                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AreaList;
