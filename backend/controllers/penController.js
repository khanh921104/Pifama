const sql = require("mssql");

// Lấy danh sách chuồng
exports.getChuongs = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool.request().query("SELECT * FROM Chuong");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách chuồng" });
  }
};

// Lấy một chuồng theo ID
exports.getChuongById = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Chuong WHERE id = @id");

    if (result.recordset.length === 0)
      return res.status(404).send("Không tìm thấy chuồng");

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Lỗi getChuongById:", error);
    res.status(500).send("Lỗi khi tìm chuồng theo mã");
  }
};

// Thêm chuồng
exports.addChuong = async (req, res) => {
  try {
    const { ma_khu, ten_chuong, suc_chua, trang_thai } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!ma_khu || !ten_chuong || !suc_chua || !trang_thai) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin chuồng!" });
    }

    const pool = await sql.connect(process.env.SQLSERVER);

    // Kiểm tra mã khu có tồn tại không (do có ràng buộc FOREIGN KEY)
    const checkKhu = await pool
      .request()
      .input("ma_khu", sql.Int, ma_khu)
      .query("SELECT * FROM KhuTrai WHERE id = @ma_khu");

    if (checkKhu.recordset.length === 0) {
      return res.status(400).json({ message: "Mã khu không tồn tại!" });
    }

    // Thêm dữ liệu mới
    await pool
      .request()
      .input("ma_khu", sql.Int, ma_khu)
      .input("ten_chuong", sql.NVarChar(100), ten_chuong)
      .input("suc_chua", sql.Int, suc_chua)
      .input("trang_thai", sql.NVarChar(50), trang_thai)
      .query(`
        INSERT INTO Chuong (ma_khu, ten_chuong, suc_chua, trang_thai)
        VALUES (@ma_khu, @ten_chuong, @suc_chua, @trang_thai)
      `);

    res.status(201).json({ message: "Thêm chuồng mới thành công!" });
  } catch (error) {
    console.error("Lỗi khi thêm chuồng:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật chuồng
exports.updateChuong = async (req, res) => {
  try {
    const { id } = req.params;
    const { ma_khu, ten_chuong, suc_chua, trang_thai } = req.body;
    const pool = await sql.connect(process.env.SQLSERVER);

    // Kiểm tra mã khu có tồn tại không (do có ràng buộc FOREIGN KEY)
    const checkKhu = await pool
      .request()
      .input("ma_khu", sql.Int, ma_khu)
      .query("SELECT * FROM KhuTrai WHERE id = @ma_khu");

    if (checkKhu.recordset.length === 0) {
      return res.status(400).json({ message: "Mã khu không tồn tại!" });
    }

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("ma_khu", sql.Int, ma_khu)
      .input("ten_chuong", sql.NVarChar(100), ten_chuong)
      .input("suc_chua", sql.Int, suc_chua)
      .input("trang_thai", sql.NVarChar(50), trang_thai)
      .query(`
        UPDATE Chuong 
        SET ma_khu = @ma_khu, ten_chuong = @ten_chuong, suc_chua = @suc_chua, trang_thai = @trang_thai 
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "Không tìm thấy chuồng" });

    // Lấy lại thông tin chuồng vừa cập nhật
    const updatedChuong = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Chuong WHERE id = @id");

    res.json(updatedChuong.recordset[0]);
  } catch (error) {
    console.error("Lỗi khi cập nhật chuồng:", error);
    res.status(500).json({ message: error.message });
  }
};

// Xóa chuồng
exports.deleteChuong = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Chuong WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Không tìm thấy chuồng để xóa" });
    }

    res.json({ message: "Xóa chuồng thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi xóa chuồng" });
  }
};