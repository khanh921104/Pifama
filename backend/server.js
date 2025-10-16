
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối database
connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/pigs", require("./routes/pigRoutes"));
app.use("/api/pens", require("./routes/penRoutes"));
app.use("/api/areas", require("./routes/areaRoutes"));
app.use("/api/foods", require("./routes/foodRoutes"));
app.use("/api/medicines", require("./routes/medicineRoutes"));
app.use("/api/staffs", require("./routes/staffRoutes"));
app.use("/api/assignments", require("./routes/assignmentRoutes"));
app.use("/api/inject-medicines", require("./routes/injectMedicineRoutes"));
app.use("/api/breeds", require("./routes/breedRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy ở cổng ${PORT}`));
