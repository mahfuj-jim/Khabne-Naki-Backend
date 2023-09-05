const AuthController = require("../controllers/auth_controller.js");
const {
  validateSignupData,
  validateLoginData,
} = require("../middleware/auth_validation.js");
const express = require("express");
const router = express.Router();

router.post("/signup", validateSignupData, AuthController.signup);
router.post("/login", validateLoginData, AuthController.login);

module.exports = router;
