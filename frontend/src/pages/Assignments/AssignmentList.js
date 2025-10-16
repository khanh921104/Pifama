// 📁 src/pages/Assignments/AssignmentList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  // 🔹 Lấy danh sách phân công
  const fetchAssignments = async () => {
    try {
      const res = await api.get("/assignments");
      setAssignments(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách:", err);
      alert("Không thể tải danh sách phân công!");
    }
  };

  // 🔹 Xóa phân công
  const deleteAssignment = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa phân công này?")) return;
    try {
      await api.delete(`/assignments/${id}`);
      setAssignments(assignments.filter((a) => a.id !== id));
      alert("Xóa thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("Không thể xóa phân công!");
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📋 Danh sách phân công cho ăn</h2>
      <button
        onClick={() => navigate("/assignments/add")}
        className="bg-green-600 text-white px-3 py-1 rounded mb-3"
      >
        ➕ Thêm phân công
      </button>

      <table className="w-full border border-gray-300 text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Nhân viên</th>
            <th className="p-2 border">Chuồng</th>
            <th className="p-2 border">Thức ăn</th>
            <th className="p-2 border">Ngày</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {assignments.length > 0 ? (
            assignments.map((a, index) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{a.ten_nv}</td>
                <td className="p-2 border">{a.ten_chuong}</td>
                <td className="p-2 border">{a.ten_thuc_an}</td>
                <td className="p-2 border">
                  {new Date(a.ngay).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => navigate(`/assignments/edit/${a.id}`)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => deleteAssignment(a.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    🗑 Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-3 text-center" colSpan="6">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentList;
