const RestaurantController = require("../controllers/restaurant_controller.js");
const {
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
router.post(
  "/review/:restaurantId",
  validateUserToken,
  RestaurantController.addRestaurantReview
);

module.exports = router;
