// 📁 src/pages/injects/VaccinationList.js
import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { Button, Table, Space, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import "../../styles/table.css";

const VaccinationList = () => {
  const [injects, setinjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🟢 Lấy danh sách tiêm thuốc
  const fetchinjects = async () => {
    setLoading(true);
    try {
      const res = await api.get("/inject-medicines");
      setinjects(res.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách tiêm thuốc");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchinjects();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/inject-medicines/${id}`);
      message.success("Xóa thành công!");
      fetchinjects();
    } catch (error) {
      message.error("Lỗi khi xóa bản ghi!");
    }
  };

  const columns = [
    
    { title: "Mã Heo", dataIndex: "ma_heo", key: "ma_heo" },
    { title: "Tên thuốc", dataIndex: "ten_thuoc", key: "ten_thuoc" },
    { title: "Nhân viên", dataIndex: "ten_nv", key: "ten_nv" },
    { title: "Liều lượng", dataIndex: "lieu_luong", key: "lieu_luong" },
    { title: "Ngày tiêm", dataIndex: "ngay_tiem", key: "ngay_tiem" },
    { title: "Ghi chú", dataIndex: "ghi_chu", key: "ghi_chu" },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`/inject-medicines/edit/${record.id}`)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa không?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="title">
        <h2>📋 Danh sách tiêm thuốc</h2>
        <Button
          type="primary"
          onClick={() => navigate("/inject-medicines/add")}
          style={{ marginBottom: 10 }}
        >
          ➕ Thêm 
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={injects}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default VaccinationList;
