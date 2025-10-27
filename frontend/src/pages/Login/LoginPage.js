import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
  setLoading(true);
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", values);

    if (res.data.token) {
      // Lưu token
      localStorage.setItem("token", res.data.token);

      // 🧩 Giải mã token để lấy thông tin user cơ bản
      try {
        const payload = res.data.token.split(".")[1];
        const decoded = JSON.parse(atob(payload));

        const user = {
          id: decoded.id,
          vai_tro: decoded.vai_tro || decoded.role || decoded.role_id || null,
          ten_dang_nhap: decoded.ten_dang_nhap || decoded.username || decoded.sub || null,
        };

        localStorage.setItem("user", JSON.stringify(user));
        console.log("✅ User đã lưu:", user);
      } catch (e) {
        console.error("Không thể decode token:", e);
        localStorage.removeItem("user");
      }

      message.success("Đăng nhập thành công!");
      navigate("/dashboard", { replace: true });
    } else {
      message.error("Không nhận được token từ server!");
    }
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    message.error(err.response?.data?.message || "Đăng nhập thất bại!");
  } finally {
    setLoading(false);
  }
};


  return (
    <Form name="login" onFinish={onFinish} style={{ maxWidth: 400, margin: "auto", marginTop: 80 }}>
      <Form.Item name="ten_dang_nhap" rules={[{ required: true, message: "Nhập tên đăng nhập!" }]}>
        <Input placeholder="Tên đăng nhập" />
      </Form.Item>
      <Form.Item name="mat_khau" rules={[{ required: true, message: "Nhập mật khẩu!" }]}>
        <Input.Password placeholder="Mật khẩu" />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading} block>
        Đăng nhập
      </Button>
    </Form>
  );
};

export default Login;
