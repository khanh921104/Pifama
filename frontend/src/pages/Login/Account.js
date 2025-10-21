import React, { useEffect, useState } from "react";
import { Card, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // dùng axios để gọi API
// import "./form.css"; // bạn có thể dùng chung file css với form

const Account = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data)); // lưu lại nếu cần
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        message.error("Không thể tải thông tin tài khoản!");
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    message.success("Đăng xuất thành công!");
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 800);
  };

  if (!user) return null;

  return (
    <div className="account-container">
      <Card title="Thông tin tài khoản" className="account-card">
        <p><strong>Tên đăng nhập:</strong> {user.ten_dang_nhap}</p>
        <p><strong>Tên nhân viên:</strong> {user.ten_nv}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Số điện thoại:</strong> {user.so_dt}</p>
        <p><strong>Vai trò:</strong> {user.vai_tro}</p>

        <Button type="primary" danger onClick={handleLogout}>
          Đăng xuất
        </Button>
      </Card>
    </div>
  );
};

export default Account;
