import React, { useEffect, useState } from "react";
import { Button, Table, Space, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../styles/table.css";

const PenList = () => {
  const [pens, setPens] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🟢 Lấy danh sách chuồng
  const fetchPens = async () => {
    setLoading(true);
    try {
      const res = await api.get("/pens");
      setPens(res.data);
    } catch (error) {
      message.error("❌ Lỗi khi tải danh sách chuồng!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPens();
  }, []);

  // 🗑️ Xóa chuồng
  const handleDelete = async (id) => {
    try {
      await api.delete(`/pens/${id}`);
      message.success("✅ Xóa chuồng thành công!");
      fetchPens();
    } catch (error) {
      message.error("❌ Lỗi khi xóa chuồng!");
    }
  };

  // 🧱 Cột của bảng
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", responsive: ["lg"] },
    { title: "Mã khu", dataIndex: "ma_khu", key: "ma_khu", responsive: ["md"] },
    { title: "Tên chuồng", dataIndex: "ten_chuong", key: "ten_chuong" },
    {
      title: "Sức chứa",
      dataIndex: "suc_chua",
      key: "suc_chua",
      align: "center",
      responsive: ["md"],
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      render: (text) => (
        <span
          style={{
            color: text === "Hoạt động" ? "green" : "gray",
            fontWeight: 500,
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => navigate(`/pens/edit/${record.id}`)}
            type="default"
            size="small"
          >
            ✏️ Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa chuồng này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small">
              🗑️ Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      className="p-4"
      style={{
        overflowX: "auto",
        width: "100%",
      }}
    >
      {/* 🔹 Tiêu đề và nút thêm */}
      <div
        className="title"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <h2 style={{ margin: 0 }}>📋 Danh sách chuồng</h2>
        <Button
          type="primary"
          onClick={() => navigate("/pens/add")}
          style={{ margin: 10 }}
        >
          ➕ Thêm chuồng mới
        </Button>
      </div>

      {/* 🔹 Bảng hiển thị danh sách chuồng */}
      <Table
        columns={columns}
        dataSource={pens}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10, responsive: true }}
        
      />
    </div>
  );
};

export default PenList;
