const express = require("express");
const router = express.Router();
const staffcontroller = require("../controllers/staffController");

router.get("/", staffcontroller.getAllNhanVien);
router.get("/:id", staffcontroller.getNhanVienById);
router.post("/", staffcontroller.addNhanVien);
router.put("/:id", staffcontroller.updateNhanVien);
router.delete("/:id", staffcontroller.deleteNhanVien);

module.exports = router;
