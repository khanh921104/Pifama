// 📁 src/pages/Assignments/AssignmentList.js
import React, { useEffect, useState } from "react";
import { Button, Table, Space, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/table.css";

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🟢 Lấy danh sách phân công
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/assignments");
      setAssignments(res.data);
    } catch (err) {
      message.error("Lỗi khi tải danh sách phân công!");
    }
    setLoading(false);
  };

  // 🗑️ Xóa phân công
  const handleDelete = async (id) => {
    try {
      await api.delete(`/assignments/${id}`);
      message.success("Xóa phân công thành công!");
      fetchAssignments();
    } catch (err) {
      message.error("Không thể xóa phân công!");
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // 📋 Cột hiển thị
  const columns = [
    // { title: "#", dataIndex: "index", key: "index", render: (_, __, i) => i + 1 },
    { title: "Nhân viên", dataIndex: "ten_nv", key: "ten_nv" },
    { title: "Chuồng", dataIndex: "ten_chuong", key: "ten_chuong" },
    { title: "Thức ăn", dataIndex: "ten_thuc_an", key: "ten_thuc_an" },
    {
      title: "Ngày",
      dataIndex: "ngay",
      key: "ngay",
      render: (ngay) => new Date(ngay).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`/assignments/edit/${record.id}`)}>
            ✏️ Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phân công này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>🗑️ Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="title">
        <h2>📋 Danh sách phân công cho ăn</h2>
        <Button
          type="primary"
          onClick={() => navigate("/assignments/add")}
          style={{ marginBottom: 10 }}
        >
          ➕ Thêm phân công
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={assignments}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default AssignmentList;
