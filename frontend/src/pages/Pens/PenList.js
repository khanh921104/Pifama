import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/table.css";
import "../../styles/form.css";

const PenList = () => {
  const [pens, setPens] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🟢 Lấy danh sách chuồng khi load trang
  useEffect(() => {
    fetchPens();
  }, []);

  const fetchPens = async () => {
    try {
      const res = await api.get("/pens");
      setPens(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách chuồng:", err);
      alert("Không thể tải danh sách chuồng!");
    } finally {
      setLoading(false);
    }
  };

  // ➕ Thêm chuồng mới
  const handleAdd = () => navigate("/pens/add");

  // ✏️ Sửa chuồng
  const handleEdit = (id) => navigate(`/pens/edit/${id}`);

  // 🗑️ Xóa chuồng
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa chuồng này không?")) return;
    try {
      await api.delete(`/pens/${id}`);
      alert("✅ Xóa chuồng thành công!");
      fetchPens(); // Tải lại danh sách
    } catch (err) {
      console.error("❌ Lỗi khi xóa chuồng:", err);
      alert("Không thể xóa chuồng!");
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h2>Danh sách chuồng</h2>

      {/* Nút thêm chuồng mới */}
      <button className="btn-add" onClick={handleAdd}>
        ➕ Thêm chuồng mới
      </button>

      {pens.length === 0 ? (
        <p>Chưa có chuồng nào trong danh sách.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã khu</th>
              <th>Tên chuồng</th>
              <th>Sức chứa</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pens.map((pen) => (
              <tr key={pen.id}>
                <td>{pen.id}</td>
                <td>{pen.ma_khu}</td>
                <td>{pen.ten_chuong}</td>
                <td>{pen.suc_chua}</td>
                <td>{pen.trang_thai}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(pen.id)}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(pen.id)}
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

export default PenList;
