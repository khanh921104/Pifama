import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { Button, Table, Space, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import "../../styles/table.css";

const StaffList = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🟢 Lấy danh sách nhân viên
  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/staffs");
      setStaffs(res.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách nhân viên!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  // 🗑️ Xóa nhân viên
  const handleDelete = async (id) => {
    try {
      await api.delete(`/staffs/${id}`);
      message.success("✅ Xóa nhân viên thành công!");
      fetchStaffs();
    } catch (error) {
      message.error("❌ Lỗi khi xóa nhân viên!");
    }
  };

  // 🧱 Định nghĩa các cột cho bảng
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên nhân viên", dataIndex: "ten_nv", key: "ten_nv" },
    { title: "SĐT", dataIndex: "so_dt", key: "so_dt" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Ngày sinh",
      dataIndex: "ngay_sinh",
      key: "ngay_sinh",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "—"),
    },
    { title: "Chức vụ", dataIndex: "ten_chuc_vu", key: "ten_chuc_vu" },
    { title: "Khu trại", dataIndex: "ten_khu", key: "ten_khu" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => navigate(`/staffs/edit/${record.id}`)}
            type="default"
          >
            ✏️ Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhân viên này không?"
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
        <h2>📋 Danh sách nhân viên</h2>
        <Button
          type="primary"
          onClick={() => navigate("/staffs/add")}
          style={{ marginBottom: 10 }}
        >
          ➕ Thêm nhân viên
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={staffs}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default StaffList;
