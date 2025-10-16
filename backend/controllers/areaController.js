const sql = require("mssql");

// 🟢 Lấy danh sách khu trại
exports.getAllKhuTrai = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool.request().query("SELECT * FROM KhuTrai");
    res.json(result.recordset);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khu trại:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách khu trại" });
  }
};

// 🟢 Lấy thông tin khu trại theo ID
exports.getKhuTraiById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM KhuTrai WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy khu trại" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Lỗi khi lấy khu trại theo ID:", error);
    res.status(500).json({ message: "Lỗi khi lấy khu trại theo ID" });
  }
};

// 🟢 Thêm khu trại mới
exports.addKhuTrai = async (req, res) => {
  try {
    const { ten_khu, dien_tich, ghi_chu } = req.body;

    if (!ten_khu) {
      return res.status(400).json({ message: "Tên khu trại là bắt buộc!" });
    }

    const pool = await sql.connect(process.env.SQLSERVER);
    await pool
      .request()
      .input("ten_khu", sql.NVarChar(100), ten_khu)
      .input("dien_tich", sql.Float, dien_tich || null)
      .input("ghi_chu", sql.NVarChar(255), ghi_chu || null)
      .query(`
        INSERT INTO KhuTrai (ten_khu, dien_tich, ghi_chu)
        VALUES (@ten_khu, @dien_tich, @ghi_chu)
      `);

    res.status(201).json({ message: "Thêm khu trại thành công!" });
  } catch (error) {
    console.error("Lỗi khi thêm khu trại:", error);
    res.status(500).json({ message: "Lỗi khi thêm khu trại" });
  }
};

// 🟢 Cập nhật khu trại
exports.updateKhuTrai = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_khu, dien_tich, ghi_chu } = req.body;

    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("ten_khu", sql.NVarChar(100), ten_khu)
      .input("dien_tich", sql.Float, dien_tich)
      .input("ghi_chu", sql.NVarChar(255), ghi_chu)
      .query(`
        UPDATE KhuTrai
        SET ten_khu = @ten_khu, dien_tich = @dien_tich, ghi_chu = @ghi_chu
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Không tìm thấy khu trại để cập nhật" });
    }

    res.json({ message: "Cập nhật khu trại thành công!" });
  } catch (error) {
    console.error("Lỗi khi cập nhật khu trại:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật khu trại" });
  }
};

// 🟢 Xóa khu trại
exports.deleteKhuTrai = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM KhuTrai WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Không tìm thấy khu trại để xóa" });
    }

    res.json({ message: "Xóa khu trại thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa khu trại:", error);
    res.status(500).json({ message: "Lỗi khi xóa khu trại" });
  }
};
