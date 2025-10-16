const express = require("express");
const router = express.Router();
const medicineController = require("../controllers/medicineController");

router.get("/", medicineController.getAllThuoc);
router.get("/:id", medicineController.getThuocById);
router.post("/", medicineController.addThuoc);
router.put("/:id", medicineController.updateThuoc);
router.delete("/:id", medicineController.deleteThuoc);

module.exports = router;
