const UserController = require("../controllers/user_controller.js");
const express = require("express");
const router = express.Router();

router.get("/all", UserController.getAllUserData);
router.get("/all/:user_id", UserController.getUserById);

module.exports = router;