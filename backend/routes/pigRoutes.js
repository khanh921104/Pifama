const express = require("express");
const router = express.Router();
const pigController = require("../controllers/pigController");

router.get("/", pigController.getPigs);
router.get("/:id", pigController.getPigById);
router.post("/", pigController.addPig);
router.put("/:id", pigController.updatePig);
router.delete("/:id", pigController.deletePig);

module.exports = router;
