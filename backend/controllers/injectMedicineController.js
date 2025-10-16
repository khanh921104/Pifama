const sql = require("mssql");

// 📦 Lấy danh sách tiêm thuốc
exports.getVaccinations = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool.request().query(`
      SELECT tt.id, 
             h.id AS ma_heo, 
             h.suc_khoe, 
             nv.ten_nv, 
             th.ten_thuoc, 
             tt.lieu_luong, 
             tt.ngay_tiem, 
             tt.ghi_chu
      FROM TiemThuocHeo tt
      JOIN Heo h ON tt.ma_heo = h.id
      JOIN Thuoc th ON tt.ma_thuoc = th.id
      JOIN NhanVien nv ON tt.ma_nv = nv.id
      WHERE nv.chuc_vu = 4 -- chỉ lấy nhân viên kỹ thuật
      ORDER BY tt.ngay_tiem DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tiêm thuốc:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📦 Lấy 1 lần tiêm thuốc theo ID
exports.getVaccinationById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT tt.*, 
               h.id AS ma_heo, 
               h.suc_khoe, 
               nv.ten_nv, 
               th.ten_thuoc
        FROM TiemThuocHeo tt
        JOIN Heo h ON tt.ma_heo = h.id
        JOIN Thuoc th ON tt.ma_thuoc = th.id
        JOIN NhanVien nv ON tt.ma_nv = nv.id
        WHERE tt.id = @id AND nv.chuc_vu = 4
      `);

    if (result.recordset.length === 0)
      return res.status(404).json({ message: "Không tìm thấy bản ghi tiêm thuốc" });

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Lỗi khi lấy tiêm thuốc:", error);
    res.status(500).json({ message: error.message });
  }
};

// ➕ Thêm bản ghi tiêm thuốc
exports.addVaccination = async (req, res) => {
  try {
    const { ma_heo, ma_thuoc, ma_nv, lieu_luong, ghi_chu, ngay_tiem } = req.body;

    // 🧩 Kiểm tra dữ liệu bắt buộc
    if (!ma_heo || !ma_thuoc || !ma_nv || !lieu_luong || !ngay_tiem)
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc (bao gồm ngày tiêm)!" });

    const pool = await sql.connect(process.env.SQLSERVER);

    // 🧩 Kiểm tra xem nhân viên có phải kỹ thuật không
    const checkNV = await pool.request()
      .input("ma_nv", sql.Int, ma_nv)
      .query(`SELECT chuc_vu FROM NhanVien WHERE id = @ma_nv`);

    if (checkNV.recordset.length === 0)
      return res.status(404).json({ message: "Không tìm thấy nhân viên!" });

    if (checkNV.recordset[0].chuc_vu !== 4)
      return res.status(403).json({ message: "Nhân viên không có quyền tiêm thuốc (không phải kỹ thuật)!" });

    // 🧩 Thêm bản ghi tiêm thuốc
    await pool.request()
      .input("ma_heo", sql.Int, ma_heo)
      .input("ma_thuoc", sql.Int, ma_thuoc)
      .input("ma_nv", sql.Int, ma_nv)
      .input("lieu_luong", sql.NVarChar, lieu_luong)
      .input("ghi_chu", sql.NVarChar, ghi_chu || null)
      .input("ngay_tiem", sql.Date, ngay_tiem)
      .query(`
        INSERT INTO TiemThuocHeo (ma_heo, ma_thuoc, ma_nv, lieu_luong, ghi_chu, ngay_tiem)
        VALUES (@ma_heo, @ma_thuoc, @ma_nv, @lieu_luong, @ghi_chu, @ngay_tiem)
      `);

    res.status(201).json({ message: "Thêm bản ghi tiêm thuốc thành công!" });
  } catch (error) {
    console.error("Lỗi khi thêm tiêm thuốc:", error);
    res.status(500).json({ message: error.message });
  }
};


// ✏️ Cập nhật thông tin tiêm thuốc
exports.updateVaccination = async (req, res) => {
  try {
    const { id } = req.params;
    const { ma_heo, ma_thuoc, ma_nv, lieu_luong, ghi_chu, ngay_tiem } = req.body;

    const pool = await sql.connect(process.env.SQLSERVER);

    // ✅ Kiểm tra xem nhân viên có phải kỹ thuật không
    const checkNV = await pool.request()
      .input("ma_nv", sql.Int, ma_nv)
      .query(`SELECT chuc_vu FROM NhanVien WHERE id = @ma_nv`);

    if (checkNV.recordset.length === 0)
      return res.status(404).json({ message: "Không tìm thấy nhân viên!" });

    if (checkNV.recordset[0].chuc_vu !== 4)
      return res.status(403).json({ message: "Nhân viên không có quyền tiêm thuốc (không phải kỹ thuật)!" });

    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("ma_heo", sql.Int, ma_heo)
      .input("ma_thuoc", sql.Int, ma_thuoc)
      .input("ma_nv", sql.Int, ma_nv)
      .input("lieu_luong", sql.NVarChar, lieu_luong)
      .input("ghi_chu", sql.NVarChar, ghi_chu)
      .input("ngay_tiem", sql.Date, ngay_tiem)
      .query(`
        UPDATE TiemThuocHeo
        SET ma_heo = @ma_heo, 
            ma_thuoc = @ma_thuoc, 
            ma_nv = @ma_nv,
            lieu_luong = @lieu_luong, 
            ghi_chu = @ghi_chu, 
            ngay_tiem = @ngay_tiem
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "Không tìm thấy bản ghi tiêm thuốc" });

    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    console.error("Lỗi khi cập nhật tiêm thuốc:", error);
    res.status(500).json({ message: error.message });
  }
};

// ❌ Xóa bản ghi tiêm thuốc
exports.deleteVaccination = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool.request().input("id", sql.Int, id)
      .query("DELETE FROM TiemThuocHeo WHERE id = @id");

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "Không tìm thấy bản ghi để xóa" });

    res.json({ message: "Xóa bản ghi tiêm thuốc thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa tiêm thuốc:", error);
    res.status(500).json({ message: error.message });
  }
};
