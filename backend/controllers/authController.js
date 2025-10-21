const sql = require("mssql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔐 Đăng nhập
exports.login = async (req, res) => {
  try {
    const { ten_dang_nhap, mat_khau } = req.body;
    if (!ten_dang_nhap || !mat_khau) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin đăng nhập!" });
    }

    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("ten_dang_nhap", sql.VarChar(50), ten_dang_nhap)
      .query("SELECT * FROM TaiKhoan WHERE ten_dang_nhap = @ten_dang_nhap");

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Tên đăng nhập không tồn tại!" });
    }

    const user = result.recordset[0];

    // So sánh mật khẩu (giả sử mật khẩu đã hash bằng bcrypt)
    // const isMatch = await bcrypt.compare(mat_khau, user.mat_khau);
    // if (!isMatch) {
    //   return res.status(401).json({ message: "Mật khẩu không chính xác!" });
    // }

    if (mat_khau !== user.mat_khau) {
        return res.status(401).json({ message: "Mật khẩu không chính xác!" });
        }

    // Tạo JWT Token
    const token = jwt.sign(
      { id: user.id, vai_tro: user.vai_tro },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({ message: "Đăng nhập thành công!", token });
  } catch (err) {
    console.error("Lỗi khi đăng nhập:", err);
    res.status(500).json({ message: "Lỗi khi đăng nhập" });
  }
};

// 👤 Lấy thông tin tài khoản hiện tại
exports.getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Thiếu token xác thực!" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");

    const pool = await sql.connect(process.env.SQLSERVER);
    const result = await pool
      .request()
      .input("id", sql.Int, decoded.id)
      .query(`
        SELECT tk.id, tk.ten_dang_nhap, tk.vai_tro, nv.ten_nv, nv.email, nv.so_dt, nv.ngay_sinh
        FROM TaiKhoan tk
        JOIN NhanVien nv ON tk.ma_nv = nv.id
        WHERE tk.id = @id
      `);

    if (result.recordset.length === 0)
      return res.status(404).json({ message: "Không tìm thấy tài khoản!" });

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin tài khoản:", err);
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};
