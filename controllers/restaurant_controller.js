const { success, failure } = require("../util/common.js");
const RestaurantModel = require("../models/restaurant_model.js");

class RestaurantController {
  async getAllRestaurantData(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;

      const filters = {};

      if (req.query.minRating) {
        filters["rating"] = { $gte: parseFloat(req.query.minRating) };
      }
      if (req.query.deliveryAreaContains) {
        filters["deliveryOptions.deliveryArea"] = {
          $regex: new RegExp(req.query.deliveryAreaContains, "i"),
        };
      }
      if (req.query.maxMenuPrice) {
        filters["menu.price"] = { $lte: parseInt(req.query.maxMenuPrice) };
      }
      if (req.query.maxDeliveryFee) {
        filters["deliveryOptions.deliveryFee"] = {
          $lte: parseInt(req.query.maxDeliveryFee),
        };
      }

      RestaurantModel.find(filters)
        // .select("-password -id")
        .then((restaurantData) => {
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedRestaurants = restaurantData.slice(
            startIndex,
            endIndex
          );

          success(res, "Successfully Received.", {
            total_restaurant: paginatedRestaurants.length,
            restaurants: paginatedRestaurants,
          });
        })
        .catch((error) => {
          console.log(error);
          failure(res, 500, "Failed to get data", "Internal Server Issue");
        });
    } catch (err) {
      failure(res, 500, "Failed to get data", "Internal Server Issue");
    }
  }
}

module.exports = new RestaurantController();
