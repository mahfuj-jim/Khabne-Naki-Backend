const RestaurantController = require("../controllers/restaurant_controller.js");
const {
  validateToken,
  validateUserToken,
  validateRestaurantViewToken,
} = require("../middleware/auth_validation.js");
const express = require("express");
const router = express.Router();

router.get(
  "/all",
  validateUserToken,
  RestaurantController.getAllRestaurantData
);
router.get(
  "/all/:restaurantId",
  validateRestaurantViewToken,
  RestaurantController.getRestaurantById
);

module.exports = router;
