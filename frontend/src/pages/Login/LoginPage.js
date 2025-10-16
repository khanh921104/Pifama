import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard"); // sau khi login chuyển đến trang quản lý heo
    } catch (err) {
      console.error(err);
      setError("Tên đăng nhập hoặc mật khẩu không đúng");
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập hệ thống trại chăn nuôi</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="username"
          placeholder="Tên đăng nhập"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;
