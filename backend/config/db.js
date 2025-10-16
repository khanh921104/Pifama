const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true, // dùng cho local
  },
};

async function connectDB() {
  try {
    await sql.connect(config);
    console.log("✅ Đã kết nối SQL Server thành công!");
  } catch (err) {
    console.error("❌ Lỗi kết nối SQL Server:", err);
  }
}

module.exports = { sql, connectDB };
