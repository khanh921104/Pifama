// 📁 src/pages/Foods/FoodList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/table.css";
import "../../styles/form.css";

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🟢 Lấy danh sách thức ăn khi load trang
  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await api.get("/foods");
      setFoods(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách thức ăn:", err);
      alert("Không thể tải danh sách thức ăn!");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Xóa thức ăn
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa thức ăn này không?")) return;

    try {
      await api.delete(`/foods/${id}`);
      alert("✅ Đã xóa thức ăn thành công!");
      fetchFoods();
    } catch (err) {
      console.error("❌ Lỗi khi xóa thức ăn:", err);
      alert("Không thể xóa thức ăn!");
    }
  };

  // ➕ Thêm mới
  const handleAdd = () => navigate("/foods/add");

  // ✏️ Sửa
  const handleEdit = (foodId) => navigate(`/foods/edit/${foodId}`);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Danh sách thức ăn</h2>

      <button onClick={handleAdd} className="add-button">
        ➕ Thêm thức ăn
      </button>

      {foods.length === 0 ? (
        <p>Chưa có thức ăn nào.</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên thức ăn</th>
              <th>Ghi chú</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food.id}>
                <td>{food.id}</td>
                <td>{food.ten_thuc_an}</td>
                <td>{food.ghi_chu || "—"}</td>
                <td>
                  <button
                    className="edit"
                    onClick={() => handleEdit(food.id)}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(food.id)}
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

export default FoodList;
