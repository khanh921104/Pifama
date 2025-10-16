// 📁 src/pages/Assignments/AssignmentForm.js
import React, { useEffect, useState , useCallback} from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosConfig";

const AssignmentForm = () => {
  const { id } = useParams(); // nếu có id => chế độ sửa
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ma_nv: "",
    ma_chuong: "",
    ma_thucan: "",
    ngay: "",
  });

  const [nhanVien, setNhanVien] = useState([]);
  const [chuong, setChuong] = useState([]);
  const [thucAn, setThucAn] = useState([]);

  // 🔹 Lấy dữ liệu combobox
  const fetchOptions = async () => {
    try {
      const [nvRes, cRes, tRes] = await Promise.all([
        api.get("/staffs"),
        api.get("/pens"),
        api.get("/foods"),
      ]);
      setNhanVien(nvRes.data);
      setChuong(cRes.data);
      setThucAn(tRes.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu chọn:", err);
    }
  };

  // 🔹 Lấy dữ liệu khi sửa
const fetchAssignment = useCallback(async () => {
  if (!id) return;
  try {
    const res = await api.get(`/assignments/${id}`);
    setForm({
      ma_nv: res.data.ma_nv,
      ma_chuong: res.data.ma_chuong,
      ma_thucan: res.data.ma_thucan,
      ngay: res.data.ngay.split("T")[0],
    });
  } catch (err) {
    console.error("Lỗi khi tải phân công:", err);
  }
}, [id]);

useEffect(() => {
  fetchOptions();
  fetchAssignment();
}, [fetchAssignment]);


  // 🔹 Cập nhật form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/assignments/${id}`, form);
        alert("Cập nhật thành công!");
      } else {
        await api.post("/assignments", form);
        alert("Thêm thành công!");
      }
      navigate("/assignments");
    } catch (err) {
      console.error("Lỗi khi gửi form:", err);
      alert(err.response?.data?.message || "Lỗi xảy ra!");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {id ? "✏️ Sửa phân công" : "➕ Thêm phân công"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nhân viên:</label>
          <select
            name="ma_nv"
            value={form.ma_nv}
            onChange={handleChange}
            required
            className="border rounded p-2 w-full"
          >
            <option value="">-- Chọn nhân viên --</option>
            {nhanVien.map((nv) => (
              <option key={nv.id} value={nv.id}>
                {nv.ten_nv}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Chuồng:</label>
          <select
            name="ma_chuong"
            value={form.ma_chuong}
            onChange={handleChange}
            required
            className="border rounded p-2 w-full"
          >
            <option value="">-- Chọn chuồng --</option>
            {chuong.map((c) => (
              <option key={c.id} value={c.id}>
                {c.ten_chuong}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Thức ăn:</label>
          <select
            name="ma_thucan"
            value={form.ma_thucan}
            onChange={handleChange}
            required
            className="border rounded p-2 w-full"
          >
            <option value="">-- Chọn thức ăn --</option>
            {thucAn.map((t) => (
              <option key={t.id} value={t.id}>
                {t.ten_thuc_an}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Ngày:</label>
          <input
            type="date"
            name="ngay"
            value={form.ngay}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {id ? "Cập nhật" : "Thêm mới"}
        </button>
      </form>
    </div>
  );
};

export default AssignmentForm;
