// 📁 src/pages/injects/VaccinationForm.js
import React, { useEffect, useState, useCallback } from "react";
import { Form, Input, Button, Select, DatePicker, message } from "antd";
import api from "../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

const VaccinationForm = () => {
  const [form] = Form.useForm();
  const [pigs, setPigs] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [employees, setEmployees] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  // 🧩 Lấy dữ liệu dropdown (heo - thuốc - nhân viên)
  const fetchDropdowns = useCallback(async () => {
    try {
      const [pigsRes, medicinesRes, empRes] = await Promise.all([
        api.get("/pigs"),
        api.get("/medicines"),
        api.get("/staffs"),
      ]);

      setPigs(pigsRes.data || []);
      setMedicines(medicinesRes.data || []);

      // lọc nhân viên kỹ thuật
      const techStaff = (empRes.data || []).filter(
        (e) => Number(e.chuc_vu) === 4
      );
      setEmployees(techStaff);
    } catch (error) {
      console.error("fetchDropdowns error:", error);
      message.error("Lỗi khi tải dữ liệu dropdown!");
    }
  }, []);

  // 📦 Nếu có ID thì load dữ liệu tiêm thuốc để sửa
  const fetchVaccination = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/inject-medicines/${id}`);
      if (res.data) {
        form.setFieldsValue({
          ma_heo: res.data.ma_heo,
          ma_thuoc: res.data.ma_thuoc,
          ma_nv: res.data.ma_nv,
          lieu_luong: res.data.lieu_luong,
          ghi_chu: res.data.ghi_chu,
          ngay_tiem: res.data.ngay_tiem ? dayjs(res.data.ngay_tiem) : null,
        });
      }
    } catch (error) {
      console.error("fetchVaccination error:", error);
      message.error("Lỗi khi tải bản ghi cần sửa!");
    }
  }, [id, form]);

  useEffect(() => {
    fetchDropdowns();
    fetchVaccination();
  }, [fetchDropdowns, fetchVaccination]);

  // 💾 Submit form
  const onFinish = async (values) => {
    try {
      const payload = {
        ma_heo: values.ma_heo,
        ma_thuoc: values.ma_thuoc,
        ma_nv: values.ma_nv,
        lieu_luong: values.lieu_luong,
        ghi_chu: values.ghi_chu || null,
        ngay_tiem: values.ngay_tiem
          ? dayjs(values.ngay_tiem).format("YYYY-MM-DD")
          : null,
      };

      if (id) {
        await api.put(`/inject-medicines/${id}`, payload);
        message.success("Cập nhật bản ghi tiêm thuốc thành công!");
      } else {
        await api.post("/inject-medicines", payload);
        message.success("Thêm bản ghi tiêm thuốc mới thành công!");
      }

      navigate("/inject-medicines");
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
          {id ? "✏️ Sửa bản ghi tiêm thuốc" : "➕ Thêm bản ghi tiêm thuốc"}
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="inject-form"
        >
          {/* 🐖 Heo */}
          <Form.Item
            name="ma_heo"
            label="Heo"
            rules={[{ required: true, message: "Vui lòng chọn heo!" }]}
          >
            <Select placeholder="Chọn heo">
              {pigs.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.id} - {p.suc_khoe || p.TrangThai}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* 💊 Thuốc */}
          <Form.Item
            name="ma_thuoc"
            label="Thuốc"
            rules={[{ required: true, message: "Vui lòng chọn thuốc!" }]}
          >
            <Select placeholder="Chọn thuốc">
              {medicines.map((t) => (
                <Select.Option key={t.id} value={t.id}>
                  {t.ten_thuoc}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* 👨‍🔬 Nhân viên */}
          <Form.Item
            name="ma_nv"
            label="Nhân viên kỹ thuật"
            rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}
          >
            <Select placeholder="Chọn nhân viên">
              {employees.map((e) => (
                <Select.Option key={e.id} value={e.id}>
                  {e.ten_nv}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* 📅 Ngày tiêm */}
          <Form.Item
            name="ngay_tiem"
            label="Ngày tiêm"
            rules={[{ required: true, message: "Vui lòng chọn ngày tiêm!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày tiêm"
              format="YYYY-MM-DD"
            />
          </Form.Item>

          {/* ⚗️ Liều lượng */}
          <Form.Item
            name="lieu_luong"
            label="Liều lượng"
            rules={[{ required: true, message: "Nhập liều lượng!" }]}
          >
            <Input placeholder="Nhập liều lượng..." />
          </Form.Item>

          {/* 📝 Ghi chú */}
          <Form.Item name="ghi_chu" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Ghi chú (nếu có)..." />
          </Form.Item>

          {/* 🧭 Nút hành động */}
          <div className="form-buttons">
            <Button type="primary" htmlType="submit">
              {id ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button
              onClick={() => navigate("/inject-medicines")}
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

export default VaccinationForm;
