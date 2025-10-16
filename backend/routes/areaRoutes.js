const express = require("express");
const router = express.Router();
const areaController = require("../controllers/areaController");

// Định nghĩa API
router.get("/", areaController.getAllKhuTrai);
router.get("/:id", areaController.getKhuTraiById);
router.post("/", areaController.addKhuTrai);
router.put("/:id", areaController.updateKhuTrai);
router.delete("/:id", areaController.deleteKhuTrai);

module.exports = router;
