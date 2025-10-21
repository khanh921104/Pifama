import React, { useEffect, useCallback } from "react";
import { Form, Input, Button, message } from "antd";
import api from "../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/form.css";

const ThuocForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  // 🟢 Lấy dữ liệu thuốc nếu đang sửa
  const fetchMedicine = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/medicines/${id}`);
      if (res.data) {
        form.setFieldsValue({
          ten_thuoc: res.data.ten_thuoc,
          cong_dung: res.data.cong_dung,
        });
      }
    } catch (error) {
      console.error("fetchMedicine error:", error);
      message.error("Lỗi khi tải dữ liệu thuốc cần sửa!");
    }
  }, [id, form]);

  useEffect(() => {
    fetchMedicine();
  }, [fetchMedicine]);

  // 🧩 Xử lý khi submit form
  const onFinish = async (values) => {
    try {
      const payload = {
        ten_thuoc: values.ten_thuoc,
        cong_dung: values.cong_dung || null,
      };

      if (id) {
        await api.put(`/medicines/${id}`, payload);
        message.success("Cập nhật thuốc thành công!");
      } else {
        await api.post("/medicines", payload);
        message.success("Thêm thuốc mới thành công!");
      }
      navigate("/medicines");
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
          {id ? "✏️ Chỉnh sửa thuốc" : "➕ Thêm thuốc mới"}
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="inject-form"
        >
          {/* 💊 Tên thuốc */}
          <Form.Item
            name="ten_thuoc"
            label="Tên thuốc"
            rules={[{ required: true, message: "Vui lòng nhập tên thuốc!" }]}
          >
            <Input placeholder="Nhập tên thuốc..." />
          </Form.Item>

          {/* 📝 Công dụng */}
          <Form.Item
            name="cong_dung"
            label="Công dụng"
          >
            <Input.TextArea rows={3} placeholder="Nhập công dụng của thuốc..." />
          </Form.Item>

          {/* 🧭 Nút hành động */}
          <div className="form-buttons">
            <Button type="primary" htmlType="submit">
              {id ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button
              onClick={() => navigate("/medicines")}
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

export default ThuocForm;