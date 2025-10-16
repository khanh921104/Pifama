
const sql = require("mssql");

// Lấy danh sách nhân viên
exports.getAllNhanVien = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool.request().query(`
      SELECT nv.id, nv.ten_nv, nv.so_dt, nv.email, nv.ngay_sinh, nv.chuc_vu, nv.ma_khu, 
             cv.ten_chuc_vu, kt.ten_khu
      FROM NhanVien nv
      LEFT JOIN ChucVu cv ON nv.chuc_vu = cv.id
      LEFT JOIN KhuTrai kt ON nv.ma_khu = kt.id
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách nhân viên:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách nhân viên" });
  }
};

// Lấy một nhân viên theo ID
exports.getNhanVienById = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        SELECT nv.id, nv.ten_nv, nv.so_dt, nv.email, nv.ngay_sinh, nv.chuc_vu, nv.ma_khu, 
               cv.ten_chuc_vu, kt.ten_khu
        FROM NhanVien nv
        LEFT JOIN ChucVu cv ON nv.chuc_vu = cv.id
        LEFT JOIN KhuTrai kt ON nv.ma_khu = kt.id
        WHERE nv.id = @id
      `);

    if (result.recordset.length === 0)
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Lỗi getNhanVienById:", error);
    res.status(500).json({ message: "Lỗi khi tìm nhân viên theo mã" });
  }
};

// Thêm nhân viên
exports.addNhanVien = async (req, res) => {
  try {
    const { ten_nv, so_dt, email, ngay_sinh, chuc_vu, ma_khu } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!ten_nv) {
      return res.status(400).json({ message: "Vui lòng nhập tên nhân viên!" });
    }

    if (!so_dt) {
    return res.status(400).json({ message: "Vui lòng nhập số điện thoại!" });
  }

    if (so_dt && (so_dt.length !== 10 || !/^\d{10}$/.test(so_dt))) {
      return res.status(400).json({ message: "Số điện thoại phải có đúng 10 chữ số!" });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ!" });
    }

    const pool = await sql.connect(process.env.SQLSERVER);

    // Kiểm tra chuc_vu có tồn tại
    if (chuc_vu) {
      const checkChucVu = await pool
        .request()
        .input("chuc_vu", sql.Int, chuc_vu)
        .query("SELECT * FROM ChucVu WHERE id = @chuc_vu");
      if (checkChucVu.recordset.length === 0) {
        return res.status(400).json({ message: "Chức vụ không tồn tại!" });
      }
    }

    // Kiểm tra ma_khu có tồn tại
    if (ma_khu) {
      const checkKhuTrai = await pool
        .request()
        .input("ma_khu", sql.Int, ma_khu)
        .query("SELECT * FROM KhuTrai WHERE id = @ma_khu");
      if (checkKhuTrai.recordset.length === 0) {
        return res.status(400).json({ message: "Khu trại không tồn tại!" });
      }
    }

    // Thêm dữ liệu mới
    await pool
      .request()
      .input("ten_nv", sql.NVarChar(100), ten_nv)
      .input("so_dt", sql.Char(10), so_dt || null)
      .input("email", sql.NVarChar(50), email || null)
      .input("ngay_sinh", sql.Date, ngay_sinh || null)
      .input("chuc_vu", sql.Int, chuc_vu || null)
      .input("ma_khu", sql.Int, ma_khu || null)
      .query(`
        INSERT INTO NhanVien (ten_nv, so_dt, email, ngay_sinh, chuc_vu, ma_khu)
        VALUES (@ten_nv, @so_dt, @email, @ngay_sinh, @chuc_vu, @ma_khu)
      `);

    res.status(201).json({ message: "Thêm nhân viên thành công!" });
  } catch (error) {
    console.error("Lỗi khi thêm nhân viên:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật nhân viên
exports.updateNhanVien = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_nv, so_dt, email, ngay_sinh, chuc_vu, ma_khu } = req.body;

    const pool = await sql.connect(process.env.SQLSERVER);

    // Kiểm tra nhân viên có tồn tại
    const checkNhanVien = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM NhanVien WHERE id = @id");
    if (checkNhanVien.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    // Kiểm tra số điện thoại
    if (so_dt && (so_dt.length !== 10 || !/^\d{10}$/.test(so_dt))) {
      return res.status(400).json({ message: "Số điện thoại phải có đúng 10 chữ số!" });
    }

    // Kiểm tra email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ!" });
    }

    // Kiểm tra chuc_vu có tồn tại
    if (chuc_vu) {
      const checkChucVu = await pool
        .request()
        .input("chuc_vu", sql.Int, chuc_vu)
        .query("SELECT * FROM ChucVu WHERE id = @chuc_vu");
      if (checkChucVu.recordset.length === 0) {
        return res.status(400).json({ message: "Chức vụ không tồn tại!" });
      }
    }

    // Kiểm tra ma_khu có tồn tại
    if (ma_khu) {
      const checkKhuTrai = await pool
        .request()
        .input("ma_khu", sql.Int, ma_khu)
        .query("SELECT * FROM KhuTrai WHERE id = @ma_khu");
      if (checkKhuTrai.recordset.length === 0) {
        return res.status(400).json({ message: "Khu trại không tồn tại!" });
      }
    }

    // Cập nhật dữ liệu
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("ten_nv", sql.NVarChar(100), ten_nv || null)
      .input("so_dt", sql.Char(10), so_dt || null)
      .input("email", sql.NVarChar(50), email || null)
      .input("ngay_sinh", sql.Date, ngay_sinh || null)
      .input("chuc_vu", sql.Int, chuc_vu || null)
      .input("ma_khu", sql.Int, ma_khu || null)
      .query(`
        UPDATE NhanVien 
        SET ten_nv = @ten_nv, so_dt = @so_dt, email = @email, ngay_sinh = @ngay_sinh, 
            chuc_vu = @chuc_vu, ma_khu = @ma_khu
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });

    // Lấy lại thông tin nhân viên vừa cập nhật
    const updatedNhanVien = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        SELECT nv.id, nv.ten_nv, nv.so_dt, nv.email, nv.ngay_sinh, nv.chuc_vu, nv.ma_khu, 
               cv.ten_chuc_vu, kt.ten_khu
        FROM NhanVien nv
        LEFT JOIN ChucVu cv ON nv.chuc_vu = cv.id
        LEFT JOIN KhuTrai kt ON nv.ma_khu = kt.id
        WHERE nv.id = @id
      `);

    res.json(updatedNhanVien.recordset[0]);
  } catch (error) {
    console.error("Lỗi khi cập nhật nhân viên:", error);
    res.status(500).json({ message: error.message });
  }
};

// Xóa nhân viên
exports.deleteNhanVien = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM NhanVien WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên để xóa" });
    }

    res.json({ message: "Xóa nhân viên thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa nhân viên:", err);
    res.status(500).json({ message: "Lỗi khi xóa nhân viên" });
  }
};