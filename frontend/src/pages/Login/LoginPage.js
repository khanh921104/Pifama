import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", values);
      const { token, user: serverUser } = res.data || {};

      if (!token) {
        message.error("Không nhận được token từ server!");
        return;
      }

      // Lưu token
      localStorage.setItem("token", token);

      // Lưu user: ưu tiên user từ server, nếu không có thì decode token payload
      let user = null;
      if (serverUser && typeof serverUser === "object") {
        user = serverUser;
      } else {
        try {
          const payload = token.split(".")[1];
          if (payload) {
            const decoded = JSON.parse(atob(payload));
            user = {
              id: decoded.id ?? decoded.sub ?? null,
              chuc_vu: Number(decoded.chuc_vu ?? decoded.vai_tro ?? decoded.role ?? decoded.role_id) || null,
              ten_dang_nhap: decoded.ten_dang_nhap ?? decoded.username ?? null,
            };
          }
        } catch (e) {
          console.warn("Không thể decode token payload:", e);
        }
      }

      // Chỉ lưu user khi có object hợp lệ, tránh lưu "undefined"
      if (user && typeof user === "object") {
        localStorage.setItem("user", JSON.stringify(user));
        console.log("✅ User đã lưu:", user);
      } else {
        localStorage.removeItem("user");
      }

      message.success("Đăng nhập thành công!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      message.error(err.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="login"
      onFinish={onFinish}
      style={{ maxWidth: 400, margin: "auto", marginTop: 80 }}
    >
      <Form.Item
        name="ten_dang_nhap"
        rules={[{ required: true, message: "Nhập tên đăng nhập!" }]}
      >
        <Input placeholder="Tên đăng nhập" />
      </Form.Item>
      <Form.Item
        name="mat_khau"
        rules={[{ required: true, message: "Nhập mật khẩu!" }]}
      >
        <Input.Password placeholder="Mật khẩu" />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading} block>
        Đăng nhập
      </Button>
    </Form>
  );
};

export default Login;
