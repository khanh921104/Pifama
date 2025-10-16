import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/form.css";

const ThuocForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ten_thuoc: "",
    cong_dung: "",
  });

  // 🟢 Nếu có id => đang sửa, tải dữ liệu thuốc
  useEffect(() => {
    if (id) {
      api
        .get(`/medicines/${id}`)
        .then((res) => setFormData(res.data))
        .catch(() => alert("Không thể tải dữ liệu thuốc cần sửa!"));
    }
  }, [id]);

  // 🧩 Cập nhật formData khi người dùng nhập
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🧩 Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/medicines/${id}`, formData);
        alert("✅ Cập nhật thuốc thành công!");
      } else {
        await api.post("/medicines", formData);
        alert("✅ Thêm thuốc thành công!");
      }
      navigate("/medicines");
    } catch (err) {
      console.error("❌ Lỗi khi lưu thuốc:", err);
      alert("Không thể lưu dữ liệu!");
    }
  };

  return (
    <div className="form-container">
      <h2>{id ? "✏️ Chỉnh sửa thuốc" : "➕ Thêm thuốc mới"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên thuốc:</label>
          <input
            type="text"
            name="ten_thuoc"
            value={formData.ten_thuoc}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Công dụng:</label>
          <textarea
            name="cong_dung"
            value={formData.cong_dung}
            onChange={handleChange}
            placeholder="Nhập công dụng của thuốc"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            💾 Lưu
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/medicines")}
          >
            ❌ Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default ThuocForm;
