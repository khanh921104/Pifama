const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.get("/me", authController.getCurrentUser);
router.post("/register", authController.register);
router.get("/check-account/:staffId", authController.checkAccountByStaffId);

module.exports = router;
