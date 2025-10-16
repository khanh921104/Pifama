const sql = require("mssql");

// 📦 Lấy danh sách phân công cho ăn
exports.getAssignments = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool.request().query(`
      SELECT p.id, nv.ten_nv, c.ten_chuong, t.ten_thuc_an, p.ngay
      FROM PhanCongChoAn p
      JOIN NhanVien nv ON p.ma_nv = nv.id
      JOIN Chuong c ON p.ma_chuong = c.id
      JOIN ThucAn t ON p.ma_thucan = t.id
      ORDER BY p.ngay DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phân công:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📦 Lấy 1 phân công theo ID
exports.getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        SELECT p.*, nv.ten_nv, c.ten_chuong, t.ten_thuc_an
        FROM PhanCongChoAn p
        JOIN NhanVien nv ON p.ma_nv = nv.id
        JOIN Chuong c ON p.ma_chuong = c.id
        JOIN ThucAn t ON p.ma_thucan = t.id
        WHERE p.id = @id
      `);

    if (result.recordset.length === 0)
      return res.status(404).json({ message: "Không tìm thấy phân công" });

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Lỗi khi lấy phân công:", error);
    res.status(500).json({ message: error.message });
  }
};

// ➕ Thêm phân công mới
exports.addAssignment = async (req, res) => {
  try {
    const { ma_nv, ma_chuong, ma_thucan, ngay } = req.body;

    if (!ma_nv || !ma_chuong || !ma_thucan)
      return res.status(400).json({ message: "Thiếu thông tin phân công!" });

    const pool = await sql.connect(process.env.SQLSERVER);
    await pool
      .request()
      .input("ma_nv", sql.Int, ma_nv)
      .input("ma_chuong", sql.Int, ma_chuong)
      .input("ma_thucan", sql.Int, ma_thucan)
      .input("ngay", sql.Date, ngay || new Date())
      .query(`
        INSERT INTO PhanCongChoAn (ma_nv, ma_chuong, ma_thucan, ngay)
        VALUES (@ma_nv, @ma_chuong, @ma_thucan, @ngay)
      `);

    res.status(201).json({ message: "Thêm phân công thành công!" });
  } catch (error) {
    console.error("Lỗi khi thêm phân công:", error);
    if (error.number === 2627)
      res.status(409).json({ message: "Phân công cho chuồng này trong ngày đã tồn tại!" });
    else res.status(500).json({ message: error.message });
  }
};

// ✏️ Cập nhật phân công
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { ma_nv, ma_chuong, ma_thucan, ngay } = req.body;

    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("ma_nv", sql.Int, ma_nv)
      .input("ma_chuong", sql.Int, ma_chuong)
      .input("ma_thucan", sql.Int, ma_thucan)
      .input("ngay", sql.Date, ngay)
      .query(`
        UPDATE PhanCongChoAn
        SET ma_nv = @ma_nv, ma_chuong = @ma_chuong, ma_thucan = @ma_thucan, ngay = @ngay
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "Không tìm thấy phân công" });

    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    console.error("Lỗi khi cập nhật phân công:", error);
    res.status(500).json({ message: error.message });
  }
};

// ❌ Xóa phân công
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool.request().input("id", sql.Int, id)
      .query("DELETE FROM PhanCongChoAn WHERE id = @id");

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "Không tìm thấy phân công để xóa" });

    res.json({ message: "Xóa phân công thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa phân công:", error);
    res.status(500).json({ message: error.message });
  }
};
