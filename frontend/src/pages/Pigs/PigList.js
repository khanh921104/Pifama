import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Space, Popconfirm, message, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../../api/axiosConfig";
import "../../styles/table.css";

const { Title } = Typography;

const PigList = () => {
  const [pigs, setPigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🟢 Lấy danh sách heo khi load trang
  useEffect(() => {
    fetchPigs();
  }, []);

  const fetchPigs = async () => {
    try {
      const res = await api.get("/pigs");
      setPigs(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách heo:", err);
      message.error("Không thể tải danh sách heo!");
    } finally {
      setLoading(false);
    }
  };

  // ➕ Thêm heo mới
  const handleAdd = () => navigate("/pigs/add");

  // ✏️ Sửa thông tin heo
  const handleEdit = (id) => navigate(`/pigs/edit/${id}`);

  // 🗑️ Xóa heo
  const handleDelete = async (id) => {
    try {
      await api.delete(`/pigs/${id}`);
      message.success("Đã xóa heo thành công!");
      fetchPigs(); // Cập nhật danh sách
    } catch (err) {
      console.error("Lỗi khi xóa heo:", err);
      message.error("Không thể xóa heo!");
    }
  };

  // 📋 Cấu hình cột cho bảng
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Mã chuồng", dataIndex: "ma_chuong", key: "ma_chuong" },
    { title: "Mã giống", dataIndex: "ma_giong", key: "ma_giong" },
    {
      title: "Ngày nhập",
      dataIndex: "ngay_nhap",
      key: "ngay_nhap",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    { title: "Cân nặng (kg)", dataIndex: "can_nang", key: "can_nang" },
    { title: "Sức khỏe", dataIndex: "suc_khoe", key: "suc_khoe" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa heo?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space
        style={{ display: "flex", justifyContent: "space-between", margin: 20 }}
      >
        <Title level={3}>🐷 Danh sách heo</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm heo mới
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={pigs}
        loading={loading}
        pagination={{ pageSize: 8 }}
        bordered
      />
    </div>
  );
};

export default PigList;
