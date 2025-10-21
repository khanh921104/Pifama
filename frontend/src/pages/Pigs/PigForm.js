import React, { useEffect, useCallback, useState } from "react";
import { Form, Input, Select, DatePicker, Button, message } from "antd";
import api from "../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import "../../styles/form.css";

const PigForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [chuongs, setChuongs] = useState([]);
  const [giongs, setGiongs] = useState([]);

  // 🟢 Tải danh sách chuồng & giống
  const fetchData = useCallback(async () => {
    try {
      const [chuongRes, giongRes] = await Promise.all([
        api.get("/pens"),
        api.get("/breeds"),
      ]);
      setChuongs(chuongRes.data || []);
      setGiongs(giongRes.data || []);
    } catch (error) {
      console.error("fetchData error:", error);
      message.error("Lỗi khi tải dữ liệu chuồng và giống!");
    }
  }, []);

  // 🟢 Lấy dữ liệu heo nếu đang sửa
  const fetchPig = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/pigs/${id}`);
      if (res.data) {
        form.setFieldsValue({
          ma_chuong: res.data.ma_chuong,
          ma_giong: res.data.ma_giong,
          ngay_nhap: res.data.ngay_nhap ? dayjs(res.data.ngay_nhap) : null,
          can_nang: res.data.can_nang,
          suc_khoe: res.data.suc_khoe,
        });
      }
    } catch (error) {
      console.error("fetchPig error:", error);
      message.error("Lỗi khi tải dữ liệu heo cần sửa!");
    }
  }, [id, form]);

  useEffect(() => {
    fetchData();
    fetchPig();
  }, [fetchData, fetchPig]);

  // 🟢 Xử lý submit form
  const onFinish = async (values) => {
    try {
      const payload = {
        ma_chuong: parseInt(values.ma_chuong),
        ma_giong: parseInt(values.ma_giong),
        ngay_nhap: values.ngay_nhap ? dayjs(values.ngay_nhap).format("YYYY-MM-DD") : null,
        can_nang: parseFloat(values.can_nang),
        suc_khoe: values.suc_khoe ? values.suc_khoe.trim() : null,
      };

      if (id) {
        await api.put(`/pigs/${id}`, payload);
        message.success("Cập nhật heo thành công!");
      } else {
        await api.post("/pigs", payload);
        message.success("Thêm heo mới thành công!");
      }
      navigate("/pigs");
    } catch (error) {
      console.error("onFinish error:", error);
      const serverMsg =
        error?.response?.data?.message || "Lỗi khi lưu dữ liệu heo!";
      message.error(serverMsg);
    }
  };

  return (
    <div className="inject-form-container">
      <div className="inject-form-box">
        <h2 className="form-title">
          {id ? "✏️ Cập nhật heo" : "➕ Thêm heo mới"}
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="inject-form"
        >
          {/* 🏠 Chuồng */}
          <Form.Item
            name="ma_chuong"
            label="Chuồng"
            rules={[{ required: true, message: "Vui lòng chọn chuồng!" }]}
          >
            <Select placeholder="Chọn chuồng">
              {chuongs.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.ten_chuong}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* 🐖 Giống heo */}
          <Form.Item
            name="ma_giong"
            label="Giống heo"
            rules={[{ required: true, message: "Vui lòng chọn giống heo!" }]}
          >
            <Select placeholder="Chọn giống heo">
              {giongs.map((g) => (
                <Select.Option key={g.id} value={g.id}>
                  {g.ten_giong}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* 📅 Ngày nhập */}
          <Form.Item
            name="ngay_nhap"
            label="Ngày nhập"
            rules={[{ required: true, message: "Vui lòng chọn ngày nhập!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày nhập"
              format="YYYY-MM-DD"
            />
          </Form.Item>

          {/* ⚖️ Cân nặng */}
          <Form.Item
            name="can_nang"
            label="Cân nặng (kg)"
            rules={[{ required: true, message: "Vui lòng nhập cân nặng!" }]}
          >
            <Input type="number" placeholder="Nhập cân nặng..." />
          </Form.Item>

          {/* 🩺 Tình trạng sức khỏe */}
          <Form.Item
            name="suc_khoe"
            label="Tình trạng sức khỏe"
          >
            <Input placeholder="Nhập tình trạng sức khỏe..." />
          </Form.Item>

          {/* 🧭 Nút hành động */}
          <div className="form-buttons">
            <Button type="primary" htmlType="submit">
              {id ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button
              onClick={() => navigate("/pigs")}
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

export default PigForm;