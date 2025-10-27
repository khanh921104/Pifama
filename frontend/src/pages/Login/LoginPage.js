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
        // lưu token
        localStorage.setItem("token", res.data.token);

        // xóa giá trị cũ (tránh để "undefined")
        localStorage.removeItem("user");

        // nếu server trả user object thì lưu trực tiếp
        if (res.data.user && typeof res.data.user === "object") {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          // fallback: nếu server chỉ trả token, giải mã payload để lấy thông tin cơ bản
          try {
            const payload = res.data.token.split(".")[1];
            const parsed = JSON.parse(atob(payload));
            const fallbackUser = {
              chuc_vu: parsed.chuc_vu ?? parsed.role ?? parsed.role_id ?? null,
              ten_dang_nhap: parsed.username ?? parsed.ten_dang_nhap ?? parsed.sub ?? null,
            };
            // chỉ lưu nếu có dữ liệu hợp lệ
            if (fallbackUser.ten_dang_nhap || fallbackUser.chuc_vu !== null) {
              localStorage.setItem("user", JSON.stringify(fallbackUser));
            }
          } catch (e) {
            // không thể giải mã -> giữ user không tồn tại
            console.warn("Không có user từ response và không thể decode token");
            localStorage.removeItem("user");
          }
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
