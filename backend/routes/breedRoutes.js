const express = require("express");
const router = express.Router();
const sql = require("mssql");

// Lấy danh sách giống heo
router.get("/", async (req, res) => {
  try {
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool.request().query("SELECT * FROM GiongHeo");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách giống heo" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Heo WHERE id = @id");
    if (result.recordset.length === 0)
      return res.status(404).json({ message: "Không tìm thấy heo" });
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy thông tin heo" });
  }
});

module.exports = router;
