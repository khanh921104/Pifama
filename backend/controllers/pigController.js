const sql = require("mssql");

// Lấy danh sách heo
exports.getPigs = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool.request().query("SELECT * FROM Heo");
    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách heo:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách heo" });
  }
};

// Lấy 1 con heo theo ID
exports.getPigById = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Heo WHERE id = @id");

    if (result.recordset.length === 0)
      return res.status(404).json({ message: "Không tìm thấy heo" });

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Lỗi getPigById:", error);
    res.status(500).json({ message: "Lỗi khi tìm heo theo ID" });
  }
};

// Thêm heo
exports.addPig = async (req, res) => {
  try {
    const { ma_chuong, ma_giong, ngay_nhap, can_nang, suc_khoe } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!ma_chuong || !ma_giong || !ngay_nhap || !can_nang || !suc_khoe) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin heo!" });
    }

    const pool = await sql.connect(process.env.SQLSERVER);

    // Thêm dữ liệu mới
    await pool
      .request()
      .input("ma_chuong", sql.Int, ma_chuong)
      .input("ma_giong", sql.Int, ma_giong)
      .input("ngay_nhap", sql.Date, ngay_nhap)
      .input("can_nang", sql.Float, can_nang)
      .input("suc_khoe", sql.NVarChar(100), suc_khoe)
      .query(`
        INSERT INTO Heo (ma_chuong, ma_giong, ngay_nhap, can_nang, suc_khoe)
        VALUES (@ma_chuong, @ma_giong, @ngay_nhap, @can_nang, @suc_khoe)
      `);

    res.status(201).json({ message: "Thêm heo mới thành công!" });
  } catch (error) {
    console.error("Lỗi khi thêm heo:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin heo
exports.updatePig = async (req, res) => {
  try {
    const { id } = req.params;
    const { ma_chuong, ma_giong, ngay_nhap, can_nang, suc_khoe } = req.body;

    const pool = await sql.connect(process.env.SQLSERVER);

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("ma_chuong", sql.Int, ma_chuong)
      .input("ma_giong", sql.Int, ma_giong)
      .input("ngay_nhap", sql.Date, ngay_nhap)
      .input("can_nang", sql.Float, can_nang)
      .input("suc_khoe", sql.NVarChar(100), suc_khoe)
      .query(`
        UPDATE Heo
        SET ma_chuong = @ma_chuong,
            ma_giong = @ma_giong,
            ngay_nhap = @ngay_nhap,
            can_nang = @can_nang,
            suc_khoe = @suc_khoe
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "Không tìm thấy heo để cập nhật" });

    // Lấy lại thông tin sau cập nhật
    const updated = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Heo WHERE id = @id");

    res.json(updated.recordset[0]);
  } catch (error) {
    console.error("Lỗi khi cập nhật heo:", error);
    res.status(500).json({ message: error.message });
  }
};

// Xóa heo
exports.deletePig = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(process.env.SQLSERVER);

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Heo WHERE id = @id");

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "Không tìm thấy heo để xóa" });

    res.json({ message: "Xóa heo thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa heo:", err);
    res.status(500).json({ message: "Lỗi khi xóa heo" });
  }
};
