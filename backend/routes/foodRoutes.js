const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");

router.get("/", foodController.getAllThucAn);
router.get("/:id", foodController.getThucAnById);
router.post("/", foodController.addThucAn);
router.put("/:id", foodController.updateThucAn);
router.delete("/:id", foodController.deleteThucAn);

module.exports = router;
