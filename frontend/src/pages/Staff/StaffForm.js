import React, { useEffect, useCallback, useState } from "react";
import { Form, Input, Select, DatePicker, Button, message } from "antd";
import api from "../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import "../../styles/form.css";

const StaffForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [khuList, setKhuList] = useState([]);

  // 🟢 Lấy danh sách khu
  const fetchAreas = useCallback(async () => {
    try {
      const res = await api.get("/areas");
      setKhuList(res.data || []);
    } catch (error) {
      console.error("fetchAreas error:", error);
      message.error("Lỗi khi tải danh sách khu!");
    }
  }, []);

  // 🟢 Lấy dữ liệu nhân viên nếu đang sửa
  const fetchStaff = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/staffs/${id}`);
      if (res.data) {
        form.setFieldsValue({
          ten_nv: res.data.ten_nv,
          so_dt: res.data.so_dt,
          email: res.data.email,
          ngay_sinh: res.data.ngay_sinh ? dayjs(res.data.ngay_sinh) : null,
          chuc_vu: res.data.chuc_vu,
          ma_khu: res.data.ma_khu,
        });
      }
    } catch (error) {
      console.error("fetchStaff error:", error);
      message.error("Lỗi khi tải dữ liệu nhân viên cần sửa!");
    }
  }, [id, form]);

  useEffect(() => {
    fetchAreas();
    fetchStaff();
  }, [fetchAreas, fetchStaff]);

  // 🧩 Xử lý khi submit form
  const onFinish = async (values) => {
    try {
      const payload = {
        ten_nv: values.ten_nv.trim(),
        so_dt: values.so_dt ? values.so_dt.trim() : null,
        email: values.email ? values.email.trim() : null,
        ngay_sinh: values.ngay_sinh ? dayjs(values.ngay_sinh).format("YYYY-MM-DD") : null,
        chuc_vu: values.chuc_vu ? parseInt(values.chuc_vu) : null,
        ma_khu: parseInt(values.ma_khu),
      };

      if (id) {
        await api.put(`/staffs/${id}`, payload);
        message.success("Cập nhật nhân viên thành công!");
      } else {
        await api.post("/staffs", payload);
        message.success("Thêm nhân viên mới thành công!");
      }
      navigate("/staffs");
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
          {id ? "✏️ Sửa nhân viên" : "➕ Thêm nhân viên mới"}
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="inject-form"
        >
          {/* 👨‍💼 Tên nhân viên */}
          <Form.Item
            name="ten_nv"
            label="Tên nhân viên"
            rules={[{ required: true, message: "Vui lòng nhập tên nhân viên!" }]}
          >
            <Input placeholder="Nhập tên nhân viên..." />
          </Form.Item>

          {/* 📞 Số điện thoại */}
          <Form.Item
            name="so_dt"
            label="Số điện thoại"
            rules={[
              {
                pattern: /^\d{10}$/,
                message: "Số điện thoại phải có đúng 10 chữ số!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại..." maxLength={10} />
          </Form.Item>

          {/* 📧 Email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: "email",
                message: "Email không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập email..." />
          </Form.Item>

          {/* 📅 Ngày sinh */}
          <Form.Item
            name="ngay_sinh"
            label="Ngày sinh"
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày sinh"
              format="YYYY-MM-DD"
            />
          </Form.Item>

          {/* 💼 Chức vụ */}
          <Form.Item
            name="chuc_vu"
            label="Mã chức vụ"
          >
            <Input placeholder="Nhập mã chức vụ..." type="number" />
          </Form.Item>

          {/* 🏞️ Mã khu */}
          <Form.Item
            name="ma_khu"
            label="Khu"
            rules={[{ required: true, message: "Vui lòng chọn khu!" }]}
          >
            <Select placeholder="Chọn khu">
              {khuList.map((khu) => (
                <Select.Option key={khu.id} value={khu.id}>
                  {khu.ten_khu}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* 🧭 Nút hành động */}
          <div className="form-buttons">
            <Button type="primary" htmlType="submit">
              {id ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button
              onClick={() => navigate("/staffs")}
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

export default StaffForm;