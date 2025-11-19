// 📁 src/pages/Staffs/StaffAccount.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Card } from "antd";
import api from "../../api/axiosConfig";

const StaffAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.get(`/staffs/${id}`);
        setStaff(res.data);
      } catch (err) {
        console.error(err);
        message.error("Không thể tải thông tin nhân viên!");
      }
    };
    fetchStaff();
  }, [id]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/register", {
        ten_dang_nhap: values.ten_dang_nhap,
        mat_khau: values.mat_khau,
        ma_nv: id,
      });
      message.success(res.data.message || "Tạo tài khoản thành công!");
      navigate("/staffs");
    } catch (err) {
      console.error(err);
      message.error(
        err.response?.data?.message ||
          "Nhân viên đã được thêm nhưng tạo tài khoản thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={`Tạo tài khoản cho nhân viên ${
        staff ? staff.ten_nv : "(đang tải...)"
      }`}
      style={{ maxWidth: 500, margin: "30px auto", borderRadius: "10px" }}
    >
      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="Tên đăng nhập"
          name="ten_dang_nhap"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input
            placeholder="Nhập tên đăng nhập"
            autoComplete="new-username"
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="mat_khau"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tạo tài khoản
          </Button>
        </Form.Item>

        <Button type="default" onClick={() => navigate("/staffs")} block>
          ← Quay lại danh sách nhân viên
        </Button>
      </Form>
    </Card>
  );
};

export default StaffAccount;
