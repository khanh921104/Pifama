import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import React, { useEffect, useState } from "react";

const FoodForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ten_thuc_an: "",
    ghi_chu: "",
  });

  useEffect(() => {
    if (id) {
      // 🟢 Nếu có id => đang sửa, tự load dữ liệu thức ăn
      api.get(`/foods/${id}`)
        .then((res) => setFormData(res.data))
        .catch(() => alert("Không thể tải dữ liệu thức ăn cần sửa!"));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/foods/${id}`, formData);
        alert("✅ Cập nhật thức ăn thành công!");
      } else {
        await api.post("/foods", formData);
        alert("✅ Thêm thức ăn thành công!");
      }
      navigate("/foods");
    } catch (err) {
      console.error("❌ Lỗi khi lưu thức ăn:", err);
      alert("Không thể lưu dữ liệu!");
    }
  };

  return (
    <div className="form-container">
      <h2>{id ? "✏️ Chỉnh sửa thức ăn" : "➕ Thêm thức ăn mới"}</h2>

      <form onSubmit={handleSubmit}>
        <label>Tên thức ăn:</label>
        <input
          type="text"
          value={formData.ten_thuc_an}
          onChange={(e) =>
            setFormData({ ...formData, ten_thuc_an: e.target.value })
          }
          required
        />

        <label>Ghi chú:</label>
        <textarea
          value={formData.ghi_chu}
          onChange={(e) =>
            setFormData({ ...formData, ghi_chu: e.target.value })
          }
        />

        <button type="submit" className="save-button">
          💾 Lưu
        </button>
      </form>
    </div>
  );
};

export default FoodForm;
