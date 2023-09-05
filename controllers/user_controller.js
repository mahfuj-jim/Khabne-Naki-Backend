const UserModel = require("../models/user_model");
const { success, failure, writeToLogFile } = require("../util/common.js");

class UserController {
    async getAllUserData(req, res) {
        try {
            UserModel.find({}, { password: false }).then((users) => {
                writeToLogFile("Get ALl Users");
                return success(res, "Successfully received user data", users);
            }).catch((err) => {
                writeToLogFile(`Error: Get All Users ${err}`);
                return failure(res, 404, "Failed to get user data", "Users not found");
            });
        } catch (err) {
            writeToLogFile(`Error: Get All Users ${err}`);
            return failure(res, 500, "Failed to get user data", "Internal Server Issue");
        }
    }

    async getUserById(req, res) {
        try {
            const { user_id } = req.params;
            UserModel.findOne({_id: user_id}, { password: false }).then((users) => {
                writeToLogFile(`Get User with ID ${user_id}`);
                return success(res, "Successfully received user data", users);
            }).catch((err) => {
                writeToLogFile(`Error: Get User with ID ${user_id} ${err}`);
                return failure(res, 404, "Failed to get user data", "Users not found");
            });
        } catch (err) {
            writeToLogFile(`Error: Get User with ID ${user_id} ${err}`);
            return failure(res, 500, "Failed to get user data", "Internal Server Issue");
        }
    }
}

module.exports = new UserController();