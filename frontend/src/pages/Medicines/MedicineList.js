// 📁 src/pages/Medicines/ThuocList.js
import React, { useEffect, useState } from "react";
import { Button, Table, Space, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/table.css";

const ThuocList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🟢 Lấy danh sách thuốc
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await api.get("/medicines");
      setMedicines(res.data);
    } catch (err) {
      message.error("Lỗi khi tải danh sách thuốc!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // 🗑️ Xóa thuốc
  const handleDelete = async (id) => {
    try {
      await api.delete(`/medicines/${id}`);
      message.success("Đã xóa thuốc thành công!");
      fetchMedicines();
    } catch (err) {
      message.error("Không thể xóa thuốc!");
    }
  };

  // ✏️ Sửa thuốc
  const handleEdit = (id) => navigate(`/medicines/edit/${id}`);

  // ➕ Thêm thuốc
  const handleAdd = () => navigate("/medicines/add");

  // 📋 Cột hiển thị
  const columns = [
    {
      title: "Tên thuốc",
      dataIndex: "ten_thuoc",
      key: "ten_thuoc",
    },
    {
      title: "Công dụng",
      dataIndex: "cong_dung",
      key: "cong_dung",
      render: (text) => text || "—",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record.id)}>✏️ Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thuốc này không?"
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
        <h2>💊 Danh sách thuốc</h2>
        <Button
          type="primary"
          onClick={handleAdd}
          style={{ marginBottom: 10 }}
        >
          ➕ Thêm thuốc
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={medicines}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default ThuocList;
