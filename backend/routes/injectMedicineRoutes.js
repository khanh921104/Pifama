const express = require("express");
const router = express.Router();
const injectMedicineController = require("../controllers/injectMedicineController");

router.get("/", injectMedicineController.getVaccinations);
router.get("/:id", injectMedicineController.getVaccinationById);
router.post("/", injectMedicineController.addVaccination);
router.put("/:id", injectMedicineController.updateVaccination);
router.delete("/:id", injectMedicineController.deleteVaccination);

module.exports = router;
