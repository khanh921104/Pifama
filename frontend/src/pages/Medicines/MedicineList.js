import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/table.css";
import "../../styles/form.css";

const ThuocList = () => {
  const [medicines, setmedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🟢 Tải danh sách thuốc
  useEffect(() => {
    fetchmedicines();
  }, []);

  const fetchmedicines = async () => {
    try {
      const res = await api.get("/medicines");
      setmedicines(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách thuốc:", err);
      alert("Không thể tải danh sách thuốc!");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Xóa thuốc
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa thuốc này không?")) return;
    try {
      await api.delete(`/medicines/${id}`);
      alert("✅ Đã xóa thuốc thành công!");
      fetchmedicines();
    } catch (err) {
      console.error("❌ Lỗi khi xóa thuốc:", err);
      alert("Không thể xóa thuốc!");
    }
  };

  // ➕ Thêm mới
  const handleAdd = () => navigate("/medicines/add");

  // ✏️ Sửa
  const handleEdit = (id) => navigate(`/medicines/edit/${id}`);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>💊 Danh sách thuốc</h2>

      <button onClick={handleAdd} className="add-button">
        ➕ Thêm thuốc
      </button>

      {medicines.length === 0 ? (
        <p>Chưa có thuốc nào.</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên thuốc</th>
              <th>Công dụng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((thuoc) => (
              <tr key={thuoc.id}>
                <td>{thuoc.id}</td>
                <td>{thuoc.ten_thuoc}</td>
                <td>{thuoc.cong_dung || "—"}</td>
                <td>
                  <button className="edit" onClick={() => handleEdit(thuoc.id)}>
                    ✏️ Sửa
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(thuoc.id)}
                    style={{ marginLeft: "8px" }}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ThuocList;
