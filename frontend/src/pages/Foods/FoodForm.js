import React, { useEffect, useCallback } from "react";
import { Form, Input, Button, message } from "antd";
import api from "../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/form.css";

const FoodForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  // 🟢 Lấy dữ liệu thức ăn nếu đang sửa
  const fetchFood = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/foods/${id}`);
      if (res.data) {
        form.setFieldsValue({
          ten_thuc_an: res.data.ten_thuc_an,
          ghi_chu: res.data.ghi_chu,
        });
      }
    } catch (error) {
      console.error("fetchFood error:", error);
      message.error("Lỗi khi tải dữ liệu thức ăn cần sửa!");
    }
  }, [id, form]);

  useEffect(() => {
    fetchFood();
  }, [fetchFood]);

  // 🧩 Xử lý khi submit form
  const onFinish = async (values) => {
    try {
      const payload = {
        ten_thuc_an: values.ten_thuc_an,
        ghi_chu: values.ghi_chu || null,
      };

      if (id) {
        await api.put(`/foods/${id}`, payload);
        message.success("Cập nhật thức ăn thành công!");
      } else {
        await api.post("/foods", payload);
        message.success("Thêm thức ăn mới thành công!");
      }
      navigate("/foods");
    } catch (error) {
      console.error("onFinish error:", error);
      const serverMsg =
        error?.response?.data?.message || "Lỗi khi lưu dữ liệu!";
      message.error(serverMsg);
    }
  };

  return (
    <div className="inject-form-container">
      <div className="inject-form-box">
        <h2 className="form-title">
          {id ? "✏️ Chỉnh sửa thức ăn" : "➕ Thêm thức ăn mới"}
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="inject-form"
        >
          {/* 🍽️ Tên thức ăn */}
          <Form.Item
            name="ten_thuc_an"
            label="Tên thức ăn"
            rules={[{ required: true, message: "Vui lòng nhập tên thức ăn!" }]}
          >
            <Input placeholder="Nhập tên thức ăn..." />
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
              onClick={() => navigate("/foods")}
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

export default FoodForm;