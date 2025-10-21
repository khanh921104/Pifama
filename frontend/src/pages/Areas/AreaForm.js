import React, { useEffect, useCallback } from "react";
import { Form, Input, Button, message } from "antd";
import api from "../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/form.css";

const AreaForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  // 🟢 Lấy dữ liệu khu trại nếu đang sửa
  const fetchArea = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/areas/${id}`);
      if (res.data) {
        form.setFieldsValue({
          ten_khu: res.data.ten_khu,
          dien_tich: res.data.dien_tich,
          ghi_chu: res.data.ghi_chu,
        });
      }
    } catch (error) {
      console.error("fetchArea error:", error);
      message.error("Lỗi khi tải dữ liệu khu trại cần sửa!");
    }
  }, [id, form]);

  useEffect(() => {
    fetchArea();
  }, [fetchArea]);

  // 🟢 Xử lý submit form
  const onFinish = async (values) => {
    try {
      const payload = {
        ten_khu: values.ten_khu.trim(),
        dien_tich: values.dien_tich ? parseFloat(values.dien_tich) : null,
        ghi_chu: values.ghi_chu ? values.ghi_chu.trim() : null,
      };

      if (id) {
        await api.put(`/areas/${id}`, payload);
        message.success("Cập nhật khu trại thành công!");
      } else {
        await api.post("/areas", payload);
        message.success("Thêm khu trại mới thành công!");
      }
      navigate("/areas");
    } catch (error) {
      console.error("onFinish error:", error);
      const serverMsg =
        error?.response?.data?.message || "Lỗi khi lưu dữ liệu khu trại!";
      message.error(serverMsg);
    }
  };

  return (
    <div className="inject-form-container">
      <div className="inject-form-box">
        <h2 className="form-title">
          {id ? "✏️ Cập nhật khu trại" : "➕ Thêm khu trại mới"}
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="inject-form"
        >
          {/* 🏞️ Tên khu trại */}
          <Form.Item
            name="ten_khu"
            label="Tên khu trại"
            rules={[{ required: true, message: "Vui lòng nhập tên khu trại!" }]}
          >
            <Input placeholder="Nhập tên khu trại..." />
          </Form.Item>

          {/* 📏 Diện tích */}
          <Form.Item
            name="dien_tich"
            label="Diện tích (m²)"
          >
            <Input type="number" placeholder="Nhập diện tích..." />
          </Form.Item>

          {/* 📝 Ghi chú */}
          <Form.Item
            name="ghi_chu"
            label="Ghi chú"
          >
            <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)..." />
          </Form.Item>

          {/* 🧭 Nút hành động */}
          <div className="form-buttons">
            <Button type="primary" htmlType="submit">
              {id ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button
              onClick={() => navigate("/areas")}
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

export default AreaForm;