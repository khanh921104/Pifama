import React, { useEffect, useCallback, useState } from "react";
import { Form, Input, Select, Button, message } from "antd";
import api from "../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/form.css";

const PenForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🟢 Lấy danh sách khu trại
  const fetchAreas = useCallback(async () => {
    try {
      const res = await api.get("/areas");
      setAreas(res.data || []);
    } catch (error) {
      console.error("fetchAreas error:", error);
      message.error("Lỗi khi tải danh sách khu trại!");
    }
  }, []);

  // 🟢 Lấy dữ liệu chuồng nếu đang sửa
  const fetchPen = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.get(`/pens/${id}`);
      if (res.data) {
        form.setFieldsValue({
          ma_khu: res.data.ma_khu,
          ten_chuong: res.data.ten_chuong,
          suc_chua: res.data.suc_chua,
          trang_thai: res.data.trang_thai,
        });
      }
    } catch (error) {
      console.error("fetchPen error:", error);
      message.error("Lỗi khi tải dữ liệu chuồng cần sửa!");
    } finally {
      setLoading(false);
    }
  }, [id, form]);

  useEffect(() => {
    fetchAreas();
    fetchPen();
  }, [fetchAreas, fetchPen]);

  // 🟢 Xử lý submit form
  const onFinish = async (values) => {
    try {
      const payload = {
        ma_khu: parseInt(values.ma_khu),
        ten_chuong: values.ten_chuong.trim(),
        suc_chua: parseInt(values.suc_chua),
        trang_thai: values.trang_thai.trim(),
      };

      if (id) {
        await api.put(`/pens/${id}`, payload);
        message.success("Cập nhật chuồng thành công!");
      } else {
        await api.post("/pens", payload);
        message.success("Thêm chuồng mới thành công!");
      }
      navigate("/pens");
    } catch (error) {
      console.error("onFinish error:", error);
      const serverMsg =
        error?.response?.data?.message || "Lỗi khi lưu dữ liệu chuồng!";
      message.error(serverMsg);
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="inject-form-container">
      <div className="inject-form-box">
        <h2 className="form-title">
          {id ? "✏️ Cập nhật chuồng" : "➕ Thêm chuồng mới"}
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="inject-form"
        >
          {/* 🏞️ Khu trại */}
          <Form.Item
            name="ma_khu"
            label="Khu trại"
            rules={[{ required: true, message: "Vui lòng chọn khu trại!" }]}
          >
            <Select placeholder="Chọn khu trại">
              {areas.map((a) => (
                <Select.Option key={a.id} value={a.id}>
                  {a.ten_khu}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* 🏠 Tên chuồng */}
          <Form.Item
            name="ten_chuong"
            label="Tên chuồng"
            rules={[{ required: true, message: "Vui lòng nhập tên chuồng!" }]}
          >
            <Input placeholder="Nhập tên chuồng..." />
          </Form.Item>

          {/* 📏 Sức chứa */}
          <Form.Item
            name="suc_chua"
            label="Sức chứa"
            rules={[{ required: true, message: "Vui lòng nhập sức chứa!" }]}
          >
            <Input type="number" placeholder="Nhập sức chứa..." />
          </Form.Item>

          {/* 📊 Trạng thái */}
          <Form.Item
            name="trang_thai"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng nhập trạng thái!" }]}
          >
            <Input placeholder="Nhập trạng thái..." />
          </Form.Item>

          {/* 🧭 Nút hành động */}
          <div className="form-buttons">
            <Button type="primary" htmlType="submit">
              {id ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button
              onClick={() => navigate("/pens")}
              style={{ marginLeft: 10 }}
            >
              Hủy
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PenForm;