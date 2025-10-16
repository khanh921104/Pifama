import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";

const AreaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    ten_khu: "",
    dien_tich: "",
    ghi_chu: "",
  });

  // 🧩 Nếu có id → đang sửa
  useEffect(() => {
    if (id) {
      api
        .get(`/areas/${id}`)
        .then((res) => setFormData(res.data))
        .catch((err) => console.error("❌ Lỗi khi tải khu trại:", err));
    }
  }, [id]);

  // 🧩 Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🧩 Gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/areas/${id}`, formData);
        alert("✅ Cập nhật khu trại thành công!");
      } else {
        await api.post("/areas", formData);
        alert("✅ Thêm khu trại thành công!");
      }
      navigate("/areas");
    } catch (err) {
      console.error("❌ Lỗi khi lưu khu trại:", err);
      alert("Đã xảy ra lỗi khi lưu khu trại.");
    }
  };

  return (
    <div className="form-container" style={{ padding: "20px" }}>
      <h2>{id ? "Cập nhật khu trại" : "Thêm khu trại mới"}</h2>

      <form onSubmit={handleSubmit} className="form">
        <label>Tên khu trại:</label>
        <input
          type="text"
          name="ten_khu"
          value={formData.ten_khu}
          onChange={handleChange}
          required
        />

        <label>Diện tích (m²):</label>
        <input
          type="number"
          name="dien_tich"
          value={formData.dien_tich}
          onChange={handleChange}
        />

        <label>Ghi chú:</label>
        <input
          type="text"
          name="ghi_chu"
          value={formData.ghi_chu}
          onChange={handleChange}
        />

        <div style={{ marginTop: "15px" }}>
          <button type="submit" className="btn-submit" style={{ marginRight: "10px" }}>
            {id ? "Cập nhật" : "Thêm mới"}
          </button>
          <button type="button" onClick={() => navigate("/areas")} className="btn-cancel">
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default AreaForm;
