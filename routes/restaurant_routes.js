const RestaurantController = require("../controllers/restaurant_controller.js");
const express = require("express");
const router = express.Router();

router.get("/all", RestaurantController.getAllRestaurantData);

module.exports = router;