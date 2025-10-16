import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/table.css";
import "../../styles/form.css";

const PigList = () => {
  const [pigs, setPigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🟢 Lấy danh sách heo khi load trang
  useEffect(() => {
    fetchPigs();
  }, []);

  const fetchPigs = async () => {
    try {
      const res = await api.get("/pigs");
      setPigs(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách heo:", err);
      alert("Không thể tải danh sách heo!");
    } finally {
      setLoading(false);
    }
  };

  // ➕ Điều hướng sang thêm mới
  const handleAdd = () => navigate("/pigs/add");

  // ✏️ Điều hướng sang sửa
  const handleEdit = (id) => navigate(`/pigs/edit/${id}`);

  // 🗑️ Xóa heo
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa con heo này không?")) return;
    try {
      await api.delete(`/pigs/${id}`);
      alert("Đã xóa heo thành công!");
      fetchPigs(); // tải lại danh sách
    } catch (err) {
      console.error("Lỗi khi xóa heo:", err);
      alert("Không thể xóa heo!");
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h2>Danh sách heo</h2>

      {/* Nút thêm heo mới */}
      <button className="btn-add" onClick={handleAdd}>
        ➕ Thêm heo mới
      </button>

      {pigs.length === 0 ? (
        <p>Chưa có heo nào trong danh sách.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã chuồng</th>
              <th>Mã giống</th>
              <th>Ngày nhập</th>
              <th>Cân nặng (kg)</th>
              <th>Sức khỏe</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pigs.map((pig) => (
              <tr key={pig.id}>
                <td>{pig.id}</td>
                <td>{pig.ma_chuong}</td>
                <td>{pig.ma_giong}</td>
                <td>{new Date(pig.ngay_nhap).toLocaleDateString()}</td>
                <td>{pig.can_nang}</td>
                <td>{pig.suc_khoe}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(pig.id)}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(pig.id)}
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

export default PigList;
