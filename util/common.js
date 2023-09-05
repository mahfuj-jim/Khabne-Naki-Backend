const path = require("path");
const fsPromise = require("fs").promises;
const jwt = require("jsonwebtoken");

const success = (res, message, result = null) => {
  res.status(200).send({ status: true, message: message, data: result });
};

const failure = (res, code, message, error = null) => {
  res.status(code).send({ status: false, message: message, error: error });
};

const getCurrentDateTime = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const writeToLogFile = async (message) => {
  const logFilePath = path.join(__dirname, "..", "server", "server.log");
  const formattedMessage = `${getCurrentDateTime()} - ${message}\n`;

  return fsPromise.appendFile(logFilePath, formattedMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
};

const generateRestaurantToken = async (restaurant) => {
  const token = jwt.sign(
    {
      restaurant: {
        _id: restaurant._id,
        name: restaurant.name,
        location: restaurant.location,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
        contactNumber: restaurant.contactNumber,
        owner: restaurant.owner,
        email: restaurant.email,
      },
      role: "restaurant",
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30s",
    }
  );

  return token;
};

const generateUserToken = async (user) => {
  const token = jwt.sign(
    {
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phoneNumber,
        location: user.location,
      },
      role: "user",
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30s",
    }
  );

  return token;
};

module.exports = {
  success,
  failure,
  writeToLogFile,
  getCurrentDateTime,
  generateRestaurantToken,
  generateUserToken,
};
