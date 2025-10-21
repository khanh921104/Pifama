import React, { useEffect, useState, useCallback } from "react";
import { Form, Select, DatePicker, Button, message } from "antd";
import api from "../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import "../../styles/form.css";

const AssignmentForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [nhanVien, setNhanVien] = useState([]);
  const [chuong, setChuong] = useState([]);
  const [thucAn, setThucAn] = useState([]);

  // 🔹 Lấy dữ liệu dropdown (nhân viên, chuồng, thức ăn)
  const fetchOptions = useCallback(async () => {
    try {
      const [nvRes, cRes, tRes] = await Promise.all([
        api.get("/staffs"),
        api.get("/pens"),
        api.get("/foods"),
      ]);
      setNhanVien(nvRes.data || []);
      setChuong(cRes.data || []);
      setThucAn(tRes.data || []);
    } catch (error) {
      console.error("fetchOptions error:", error);
      message.error("Lỗi khi tải dữ liệu dropdown!");
    }
  }, []);

  // 🔹 Lấy dữ liệu phân công để sửa
  const fetchAssignment = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/assignments/${id}`);
      if (res.data) {
        form.setFieldsValue({
          ma_nv: res.data.ma_nv,
          ma_chuong: res.data.ma_chuong,
          ma_thucan: res.data.ma_thucan,
          ngay: res.data.ngay ? dayjs(res.data.ngay) : null,
        });
      }
    } catch (error) {
      console.error("fetchAssignment error:", error);
      message.error("Lỗi khi tải bản ghi cần sửa!");
    }
  }, [id, form]);

  useEffect(() => {
    fetchOptions();
    fetchAssignment();
  }, [fetchOptions, fetchAssignment]);

  // 🔹 Gửi form
  const onFinish = async (values) => {
    try {
      const payload = {
        ma_nv: values.ma_nv,
        ma_chuong: values.ma_chuong,
        ma_thucan: values.ma_thucan,
        ngay: values.ngay ? dayjs(values.ngay).format("YYYY-MM-DD") : null,
      };

      if (id) {
        await api.put(`/assignments/${id}`, payload);
        message.success("Cập nhật phân công thành công!");
      } else {
        await api.post("/assignments", payload);
        message.success("Thêm phân công mới thành công!");
      }
      navigate("/assignments");
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
          {id ? "✏️ Sửa phân công" : "➕ Thêm phân công"}
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="inject-form"
        >
          {/* 👨‍🔬 Nhân viên */}
          <Form.Item
            name="ma_nv"
            label="Nhân viên"
            rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}
          >
            <Select placeholder="Chọn nhân viên">
              {nhanVien.map((nv) => (
                <Select.Option key={nv.id} value={nv.id}>
                  {nv.ten_nv}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* 🏠 Chuồng */}
          <Form.Item
            name="ma_chuong"
            label="Chuồng"
            rules={[{ required: true, message: "Vui lòng chọn chuồng!" }]}
          >
            <Select placeholder="Chọn chuồng">
              {chuong.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.ten_chuong}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* 🍽️ Thức ăn */}
          <Form.Item
            name="ma_thucan"
            label="Thức ăn"
            rules={[{ required: true, message: "Vui lòng chọn thức ăn!" }]}
          >
            <Select placeholder="Chọn thức ăn">
              {thucAn.map((t) => (
                <Select.Option key={t.id} value={t.id}>
                  {t.ten_thuc_an}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* 📅 Ngày */}
          <Form.Item
            name="ngay"
            label="Ngày"
            rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày"
              format="YYYY-MM-DD"
            />
          </Form.Item>

          {/* 🧭 Nút hành động */}
          <div className="form-buttons">
            <Button type="primary" htmlType="submit">
              {id ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button
              onClick={() => navigate("/assignments")}
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

export default AssignmentForm;