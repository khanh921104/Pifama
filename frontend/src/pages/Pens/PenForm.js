import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

const PenForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ma_khu: "",
    ten_chuong: "",
    suc_chua: "",
    trang_thai: "",
  });
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🟢 Lấy danh sách khu trại để chọn (dropdown)
  useEffect(() => {
    api
      .get("/areas")
      .then((res) => setAreas(res.data))
      .catch((err) => console.error("Lỗi khi tải khu trại:", err));
  }, []);

  // 🟢 Nếu có id thì load thông tin chuồng để sửa
  useEffect(() => {
    if (id) {
      setLoading(true);
      api
        .get(`/pens/${id}`)
        .then((res) => setFormData(res.data))
        .catch((err) => console.error("Lỗi khi tải chuồng:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // 🟢 Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/pens/${id}`, formData);
        alert("✅ Cập nhật chuồng thành công!");
      } else {
        await api.post("/pens", formData);
        alert("✅ Thêm chuồng mới thành công!");
      }
      navigate("/pens");
    } catch (err) {
      console.error("❌ Lỗi khi lưu chuồng:", err);
      alert("Lỗi khi lưu dữ liệu chuồng!");
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{id ? "Cập nhật chuồng" : "Thêm chuồng mới"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Khu trại:</label>
          <select name="ma_khu" value={formData.ma_khu} onChange={handleChange} required>
            <option value="">-- Chọn khu trại --</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.ten_khu}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Tên chuồng:</label>
          <input
            type="text"
            name="ten_chuong"
            value={formData.ten_chuong}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Sức chứa:</label>
          <input
            type="number"
            name="suc_chua"
            value={formData.suc_chua}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Trạng thái:</label>
          <input
            type="text"
            name="trang_thai"
            value={formData.trang_thai}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">{id ? "Cập nhật" : "Thêm mới"}</button>
      </form>
    </div>
  );
};

export default PenForm;
