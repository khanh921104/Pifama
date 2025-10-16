const express = require("express");
const router = express.Router();
const sql = require("mssql");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM TaiKhoan WHERE ten_dang_nhap = @username");

    if (result.recordset.length === 0)
      return res.status(401).json({ message: "Sai tài khoản" });

    const user = result.recordset[0];

    if (user.mat_khau === password) {
      res.json({ message: "Đăng nhập thành công", user });
    } else {
      res.status(401).json({ message: "Sai mật khẩu" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
