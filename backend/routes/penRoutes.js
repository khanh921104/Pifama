const express = require("express");
const router = express.Router();
const penController = require("../controllers/penController");

router.get("/", penController.getChuongs);
router.get("/:id", penController.getChuongById);
router.post("/", penController.addChuong);
router.put("/:id", penController.updateChuong);
router.delete("/:id", penController.deleteChuong);

module.exports = router;