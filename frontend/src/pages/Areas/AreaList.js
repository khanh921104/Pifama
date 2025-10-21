import React, { useEffect, useState } from "react";
import { Button, Table, Space, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/table.css";

const AreaList = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🟢 Lấy danh sách khu trại
  const fetchAreas = async () => {
    setLoading(true);
    try {
      const res = await api.get("/areas");
      setAreas(res.data);
    } catch (err) {
      message.error("❌ Lỗi khi tải danh sách khu trại!");
      console.error("Lỗi khi tải danh sách khu trại:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  // 🗑️ Xóa khu trại
  const handleDelete = async (id) => {
    try {
      await api.delete(`/areas/${id}`);
      message.success("✅ Xóa khu trại thành công!");
      fetchAreas();
    } catch (err) {
      console.error("❌ Lỗi khi xóa khu trại:", err);
      message.error("Không thể xóa khu trại!");
    }
  };

  // 🔹 Cấu hình cột cho bảng
  const columns = [
    // { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên khu", dataIndex: "ten_khu", key: "ten_khu" },
    { title: "Diện tích (m²)", dataIndex: "dien_tich", key: "dien_tich" },
    { title: "Ghi chú", dataIndex: "ghi_chu", key: "ghi_chu" },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => navigate(`/areas/edit/${record.id}`)}
          >
            ✏️ Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa khu trại này không?"
            onConfirm={() => handleDelete(record.id)}
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
        <h2>📋 Danh sách khu trại</h2>
        <Button
          type="primary"
          onClick={() => navigate("/areas/add")}
          style={{ margin: 10 }}
        >
          ➕ Thêm khu trại
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={areas}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default AreaList;
