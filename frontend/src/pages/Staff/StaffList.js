import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/table.css";
import "../../styles/form.css";

const StaffList = () => {
  const [staffs, setStaffs] = useState([]);
  const navigate = useNavigate();

  // 🟢 Lấy danh sách nhân viên
  const fetchStaffs = async () => {
    try {
      const res = await api.get("/staffs");
      setStaffs(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách nhân viên:", err);
      alert("Không thể tải danh sách nhân viên!");
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  // 🗑️ Xóa nhân viên
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này không?")) {
      try {
        await api.delete(`/staffs/${id}`);
        alert("✅ Xóa nhân viên thành công!");
        fetchStaffs();
      } catch (err) {
        console.error("❌ Lỗi khi xóa nhân viên:", err);
        alert("Không thể xóa nhân viên!");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách nhân viên</h2>
      <button onClick={() => navigate("/staffs/add")}>+ Thêm nhân viên mới</button>

      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "15px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên nhân viên</th>
            <th>SĐT</th>
            <th>Email</th>
            <th>Ngày sinh</th>
            <th>Chức vụ</th>
            <th>Khu trại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {staffs.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                Chưa có nhân viên nào.
              </td>
            </tr>
          ) : (
            staffs.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.ten_nv}</td>
                <td>{s.so_dt}</td>
                <td>{s.email}</td>
                <td>{s.ngay_sinh ? new Date(s.ngay_sinh).toLocaleDateString() : "—"}</td>
                <td>{s.ten_chuc_vu || "—"}</td>
                <td>{s.ten_khu || "—"}</td>
                <td>
                  <button onClick={() => navigate(`/staffs/edit/${s.id}`)} className="btn-edit">✏️ Sửa</button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="btn-delete"
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaffList;
