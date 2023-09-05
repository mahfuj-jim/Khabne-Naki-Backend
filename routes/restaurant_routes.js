const RestaurantController = require("../controllers/restaurant_controller.js");
const {validateToken, validateUserToken} = require("../middleware/auth_validation.js");
const express = require("express");
const router = express.Router();

router.get("/all", validateToken, validateUserToken, RestaurantController.getAllRestaurantData);

module.exports = router;