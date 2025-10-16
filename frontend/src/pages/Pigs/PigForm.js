import React, { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";

const PigForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Nếu có id → đang sửa, nếu không → thêm mới

  const [formData, setFormData] = useState({
    ma_chuong: "",
    ma_giong: "",
    ngay_nhap: "",
    can_nang: "",
    suc_khoe: "",
  });

  const [chuongs, setChuongs] = useState([]);
  const [giongs, setGiongs] = useState([]);

  // 🧩 Tải danh sách chuồng & giống
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chuongRes, giongRes] = await Promise.all([
          axios.get("/pens"),
          axios.get("/breeds"),
        ]);
        setChuongs(chuongRes.data);
        setGiongs(giongRes.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu chuồng và giống:", err);
      }
    };
    fetchData();
  }, []);

  // 🧩 Nếu đang sửa, tải thông tin heo cần chỉnh
  useEffect(() => {
    if (id) {
      axios
        .get(`/pigs/${id}`)
        .then((res) => {
          const data = res.data;
          // Format ngày nhập cho input date
          const ngayNhap = data.ngay_nhap
            ? new Date(data.ngay_nhap).toISOString().split("T")[0]
            : "";
          setFormData({
            ma_chuong: data.ma_chuong,
            ma_giong: data.ma_giong,
            ngay_nhap: ngayNhap,
            can_nang: data.can_nang,
            suc_khoe: data.suc_khoe,
          });
        })
        .catch((err) => console.error("Lỗi khi lấy dữ liệu heo:", err));
    }
  }, [id]);

  // 🧩 Cập nhật state khi thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🧩 Gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Chuẩn hóa dữ liệu gửi đi
    const dataToSend = {
      ma_chuong: parseInt(formData.ma_chuong),
      ma_giong: parseInt(formData.ma_giong),
      ngay_nhap: formData.ngay_nhap,
      can_nang: parseFloat(formData.can_nang),
      suc_khoe: formData.suc_khoe.trim(),
    };

    console.log("📤 Dữ liệu gửi lên:", dataToSend);

    try {
      if (id) {
        // Cập nhật
        await axios.put(`/pigs/${id}`, dataToSend);
        alert("✅ Cập nhật heo thành công!");
      } else {
        // Thêm mới
        await axios.post("/pigs", dataToSend);
        alert("✅ Thêm heo mới thành công!");
      }

      navigate("/pigs");
    } catch (err) {
      console.error("❌ Lỗi khi lưu heo:", err);
      alert("Đã xảy ra lỗi khi lưu dữ liệu.");
    }
  };

  return (
    <div className="form-container">
      <h2>{id ? "Cập nhật heo" : "Thêm heo mới"}</h2>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Chuồng:</label>
          <select
            name="ma_chuong"
            value={formData.ma_chuong}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn chuồng --</option>
            {chuongs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.ten_chuong}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Giống heo:</label>
          <select
            name="ma_giong"
            value={formData.ma_giong}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn giống heo --</option>
            {giongs.map((g) => (
              <option key={g.id} value={g.id}>
                {g.ten_giong}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Ngày nhập:</label>
          <input
            type="date"
            name="ngay_nhap"
            value={formData.ngay_nhap || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Cân nặng (kg):</label>
          <input
            type="number"
            name="can_nang"
            value={formData.can_nang}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Tình trạng sức khỏe:</label>
          <input
            type="text"
            name="suc_khoe"
            value={formData.suc_khoe}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {id ? "💾 Cập nhật" : "➕ Thêm mới"}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/pigs")}
          >
            ❌ Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default PigForm;
