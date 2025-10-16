import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

const StaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState({
    ten_nv: "",
    so_dt: "",
    email: "",
    ngay_sinh: "",
    chuc_vu: "",
    ma_khu: "",
  });
  const [khuList, setKhuList] = useState([]); // Thêm state lưu danh sách khu

  useEffect(() => {
    // Lấy danh sách khu từ API
    api.get("/areas")
      .then(res => setKhuList(res.data))
      .catch(err => console.error("Lỗi khi tải danh sách khu:", err));
  }, []);

  useEffect(() => {
    if (id) {
      api.get(`/staffs/${id}`)
        .then((res) => setStaff(res.data))
        .catch((err) => console.error("Lỗi khi tải nhân viên:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    setStaff({ ...staff, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ten_nv: staff.ten_nv.trim(),
      so_dt: staff.so_dt.trim(),
      email: staff.email.trim(),
      ngay_sinh: staff.ngay_sinh,
      chuc_vu: parseInt(staff.chuc_vu),
      ma_khu: parseInt(staff.ma_khu)
    };

    console.log("📤 Dữ liệu gửi lên:", dataToSend);

    try {
      if (id) {
        await api.put(`/staffs/${id}`, dataToSend);
      } else {
        await api.post("/staffs", dataToSend);
      }
      navigate("/staffs");
    } catch (err) {
      console.error("Lỗi khi lưu nhân viên:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? "Sửa nhân viên" : "Thêm nhân viên"}</h2>
      <label>Tên nhân viên:</label>
      <input type="text" name="ten_nv" value={staff.ten_nv} onChange={handleChange} required />
      <br />

      <label>Số điện thoại:</label>
      <input type="text" name="so_dt" value={staff.so_dt} onChange={handleChange} maxLength={10} />
      <br />

      <label>Email:</label>
      <input type="email" name="email" value={staff.email} onChange={handleChange} />
      <br />

      <label>Ngày sinh:</label>
      <input type="date" name="ngay_sinh" value={staff.ngay_sinh?.split("T")[0] || ""} onChange={handleChange} />
      <br />

      <label>Mã chức vụ:</label>
      <input type="number" name="chuc_vu" value={staff.chuc_vu} onChange={handleChange} />
      <br />

      <label>Mã khu:</label>
      <select name="ma_khu" value={staff.ma_khu} onChange={handleChange} required>
        <option value="">-- Chọn khu --</option>
        {khuList.map((khu) => (
          <option key={khu.id} value={khu.id}>
            {khu.ten_khu}
          </option>
        ))}
      </select>
      <br />

      <button type="submit">Lưu</button>
    </form>
  );
};

export default StaffForm;
