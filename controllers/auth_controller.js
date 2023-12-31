const { success, failure } = require("../util/common.js");
const UserModel = require("../models/user_model.js");
const RestaurantModel = require("../models/restaurant_model.js");
const AuthModel = require("../models/auth_model.js");
const {
  generateRestaurantToken,
  generateUserToken,
} = require("../util/common.js");
const bcrypt = require("bcrypt");

class AuthController {
  async signup(req, res) {
    try {
      const response = JSON.parse(req.body);
      const { email, password, role } = response;

      const isEmailExists = await AuthModel.findOne({ email });
      if (isEmailExists) {
        return failure(res, 400, "Failed to register", "Email already in use");
      }

      const newInstance = response;
      delete newInstance.role;
      delete newInstance.password;

      let id, token;

      if (role === 1) {
        await UserModel.create(newInstance)
          .then(async (createdUser) => {
            id = createdUser._id;
            token = await generateUserToken(createdUser);
          })
          .catch((error) => {
            console.log("Error");
            console.log(error);
            failure(res, 500, "Failed to register", "Internal Server Issue");
          });
      } else if (role === 2) {
        await RestaurantModel.create(newInstance)
          .then(async (createdRestaurant) => {
            id = createdRestaurant._id;
            token = await generateRestaurantToken(createdRestaurant);
          })
          .catch((error) => {
            console.log(error);
            return failure(
              res,
              500,
              "Failed to register",
              "Internal Server Issue"
            );
          });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAuth = {
        email: email,
        password: hashedPassword,
        verified: false,
        role: role,
        user: role === 1 ? id : null,
        restaurant: role === 2 ? id : null,
      };

      await AuthModel.create(newAuth)
        .then((auth) => {
          return success(res, "Registered successfully", {
            token,
            data: { id: id, ...newInstance },
          });
        })
        .catch((err) => {
          console.log(err);
          return failure(
            res,
            500,
            "Failed to register",
            "Internal Server Issue"
          );
        });
    } catch (err) {
      console.log(err);
      return failure(res, 500, "Failed to signup", "Internal server error");
    }
  }

  async login(req, res) {
    try {
      const { email, password } = JSON.parse(req.body);

      AuthModel.findOne({ email })
        .populate("user")
        .populate("restaurant")
        .exec()
        .then(async (auth) => {
          if (auth.blockUntil && auth.blockUntil > new Date()) {
            const remainingTimeInSeconds = Math.ceil(
              (auth.blockUntil - new Date()) / 1000
            );
            return failure(
              res,
              401,
              "Login failed",
              `Account is blocked. Try again in ${remainingTimeInSeconds} seconds.`
            );
          }

          const isPasswordValid = await bcrypt.compare(password, auth.password);

          if (!isPasswordValid) {
            auth.loginAttempts = (auth.loginAttempts || 0) + 1;

            if (auth.loginAttempts >= 5) {
              const blockUntil = new Date(Date.now() + 5 * 60 * 1000);
              auth.blockUntil = blockUntil;
              auth.loginAttempts = 0;

              await auth.save();
              return failure(
                res,
                401,
                "Login failed",
                `Invalid Credential. Account is blocked for 5 minutes.`
              );
            }

            await auth.save();
            return failure(res, 401, "Login failed", "Invalid Credential");
          }

          auth.loginAttempts = 0;
          await auth.save();

          let responseData, token;

          if (auth.role === 1) {
            token = await generateUserToken(auth.user);
            responseData = auth.user;
          } else if (auth.role === 2) {
            token = await generateRestaurantToken(auth.restaurant);
            responseData = auth.restaurant;
          }

          return success(res, "Authentication successful", {
            token: token,
            data: responseData,
          });
        })
        .catch((error) => {
          console.log(error);
          return failure(res, 401, "Login failed", "Invalid Credential");
        });
    } catch (err) {
      return failure(res, 500, "Failed to signup", "Internal server error");
    }
  }
}

module.exports = new AuthController();
