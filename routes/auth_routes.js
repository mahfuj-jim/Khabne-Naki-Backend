const AuthController = require("../controllers/auth_controller.js");
const {
  validateSignupData,
  validateLoginData,
} = require("../middleware/auth_validation.js");
const express = require("express");
const router = express.Router();

routes.post("/signup", validateSignupData, AuthController.signup);
routes.post("/login", validateLoginData, AuthController.login);

module.exports = router;
