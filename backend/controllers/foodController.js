// 📁 controllers/foodController.js
const sql = require("mssql");

// 📦 Lấy danh sách thức ăn
exports.getAllThucAn = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool.request().query("SELECT * FROM ThucAn");
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách thức ăn:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách thức ăn" });
  }
};

// 🔍 Lấy một thức ăn theo ID
exports.getThucAnById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM ThucAn WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy thức ăn" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("❌ Lỗi getThucAnById:", error);
    res.status(500).json({ message: "Lỗi khi tìm thức ăn theo mã" });
  }
};

// ➕ Thêm thức ăn
exports.addThucAn = async (req, res) => {
  try {
    const { ten_thuc_an, ghi_chu } = req.body;

    if (!ten_thuc_an) {
      return res.status(400).json({ message: "Vui lòng nhập tên thức ăn!" });
    }

    const pool = await sql.connect(process.env.SQLSERVER);

    // Kiểm tra trùng tên
    const check = await pool
      .request()
      .input("ten_thuc_an", sql.NVarChar(100), ten_thuc_an)
      .query("SELECT * FROM ThucAn WHERE ten_thuc_an = @ten_thuc_an");

    if (check.recordset.length > 0) {
      return res.status(409).json({ message: "Tên thức ăn đã tồn tại!" });
    }

    // Thêm và trả về bản ghi vừa thêm
    const insert = await pool
      .request()
      .input("ten_thuc_an", sql.NVarChar(100), ten_thuc_an)
      .input("ghi_chu", sql.NVarChar(250), ghi_chu || null)
      .query(`
        INSERT INTO ThucAn (ten_thuc_an, ghi_chu)
        OUTPUT INSERTED.*
        VALUES (@ten_thuc_an, @ghi_chu)
      `);

    res.status(201).json(insert.recordset[0]);
  } catch (error) {
    console.error("❌ Lỗi khi thêm thức ăn:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Cập nhật thức ăn
exports.updateThucAn = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_thuc_an, ghi_chu } = req.body;

    const pool = await sql.connect(process.env.SQLSERVER);

    // Kiểm tra trùng tên
    const check = await pool
      .request()
      .input("ten_thuc_an", sql.NVarChar(100), ten_thuc_an)
      .input("id", sql.Int, id)
      .query(
        "SELECT * FROM ThucAn WHERE ten_thuc_an = @ten_thuc_an AND id != @id"
      );

    if (check.recordset.length > 0) {
      return res.status(409).json({ message: "Tên thức ăn đã tồn tại!" });
    }

    // Cập nhật
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("ten_thuc_an", sql.NVarChar(100), ten_thuc_an)
      .input("ghi_chu", sql.NVarChar(250), ghi_chu || null)
      .query(`
        UPDATE ThucAn
        SET ten_thuc_an = @ten_thuc_an, ghi_chu = @ghi_chu
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Không tìm thấy thức ăn" });
    }

    // Trả về bản ghi vừa cập nhật
    const updated = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM ThucAn WHERE id = @id");

    res.json(updated.recordset[0]);
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật thức ăn:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ Xóa thức ăn
exports.deleteThucAn = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM ThucAn WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thức ăn để xóa" });
    }

    res.json({ message: "Xóa thức ăn thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa thức ăn:", err);
    res.status(500).json({ message: "Lỗi khi xóa thức ăn" });
  }
};
