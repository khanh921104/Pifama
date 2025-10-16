const sql = require("mssql");

// Lấy danh sách thuốc
exports.getAllThuoc = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool.request().query("SELECT * FROM Thuoc");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách thuốc" });
  }
};

// Lấy một thuốc theo ID
exports.getThuocById = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Thuoc WHERE id = @id");

    if (result.recordset.length === 0)
      return res.status(404).send("Không tìm thấy thuốc");

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Lỗi getThuocById:", error);
    res.status(500).send("Lỗi khi tìm thuốc theo mã");
  }
};

// Thêm thuốc
exports.addThuoc = async (req, res) => {
  try {
    const { ten_thuoc, cong_dung } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!ten_thuoc) {
      return res.status(400).json({ message: "Vui lòng nhập tên thuốc!" });
    }

    const pool = await sql.connect(process.env.SQLSERVER);

    // Kiểm tra tên thuốc có bị trùng không
    const check = await pool
      .request()
      .input("ten_thuoc", sql.NVarChar(100), ten_thuoc)
      .query("SELECT * FROM Thuoc WHERE ten_thuoc = @ten_thuoc");

    if (check.recordset.length > 0) {
      return res.status(409).json({ message: "Tên thuốc đã tồn tại!" });
    }

    // Thêm dữ liệu mới
    await pool
      .request()
      .input("ten_thuoc", sql.NVarChar(100), ten_thuoc)
      .input("cong_dung", sql.NVarChar(255), cong_dung || null)
      .query(`
        INSERT INTO Thuoc (ten_thuoc, cong_dung)
        VALUES (@ten_thuoc, @cong_dung)
      `);

    res.status(201).json({ message: "Thêm thuốc mới thành công!" });
  } catch (error) {
    console.error("Lỗi khi thêm thuốc:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thuốc
exports.updateThuoc = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_thuoc, cong_dung } = req.body;

    const pool = await sql.connect(process.env.SQLSERVER);

    // Kiểm tra tên thuốc có bị trùng với thuốc khác không
    const check = await pool
      .request()
      .input("ten_thuoc", sql.NVarChar(100), ten_thuoc)
      .input("id", sql.Int, id)
      .query("SELECT * FROM Thuoc WHERE ten_thuoc = @ten_thuoc AND id != @id");

    if (check.recordset.length > 0) {
      return res.status(409).json({ message: "Tên thuốc đã tồn tại!" });
    }

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("ten_thuoc", sql.NVarChar(100), ten_thuoc)
      .input("cong_dung", sql.NVarChar(255), cong_dung || null)
      .query(`
        UPDATE Thuoc 
        SET ten_thuoc = @ten_thuoc, cong_dung = @cong_dung 
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "Không tìm thấy thuốc" });

    // Lấy lại thông tin thuốc vừa cập nhật
    const updatedThuoc = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Thuoc WHERE id = @id");

    res.json(updatedThuoc.recordset[0]);
  } catch (error) {
    console.error("Lỗi khi cập nhật thuốc:", error);
    res.status(500).json({ message: error.message });
  }
};

// Xóa thuốc
exports.deleteThuoc = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Thuoc WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Không tìm thấy thuốc để xóa" });
    }

    res.json({ message: "Xóa thuốc thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi xóa thuốc" });
  }
};