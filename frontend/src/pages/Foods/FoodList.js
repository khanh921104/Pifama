// 📁 src/pages/Foods/FoodList.js
import React, { useEffect, useState } from "react";
import { Button, Table, Space, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/table.css";

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🟢 Lấy danh sách thức ăn
  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await api.get("/foods");
      setFoods(res.data);
    } catch (err) {
      message.error("Lỗi khi tải danh sách thức ăn!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // 🗑️ Xóa thức ăn
  const handleDelete = async (id) => {
    try {
      await api.delete(`/foods/${id}`);
      message.success("Đã xóa thức ăn thành công!");
      fetchFoods();
    } catch (err) {
      message.error("Không thể xóa thức ăn!");
    }
  };

  // ✏️ Sửa thức ăn
  const handleEdit = (id) => navigate(`/foods/edit/${id}`);

  // ➕ Thêm thức ăn
  const handleAdd = () => navigate("/foods/add");

  // 📋 Cột hiển thị
  const columns = [
    {
      title: "Tên thức ăn",
      dataIndex: "ten_thuc_an",
      key: "ten_thuc_an",
    },
    {
      title: "Ghi chú",
      dataIndex: "ghi_chu",
      key: "ghi_chu",
      render: (text) => text || "—",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record.id)}>✏️ Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thức ăn này không?"
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
        <h2>📦 Danh sách thức ăn</h2>
        <Button
          type="primary"
          onClick={handleAdd}
          style={{ marginBottom: 10 }}
        >
          ➕ Thêm thức ăn
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={foods}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default FoodList;
