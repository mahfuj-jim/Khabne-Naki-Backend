const validator = require("validator");

function validateSignupData(req, res, next) {
  const { role } = JSON.parse(req.body);

  if (role === 1) {
    validateUserData(req, res, next);
  } else if (role === 2) {
    validateRestaurantData(req, res, next);
  } else {
    return res.status(400).json({
      success: false,
      message: "Register Failed",
      error: "Invalid Role",
    });
  }
}

function validateLoginData(req, res, next) {
  const { email, password } = JSON.parse(req.body);
  const errors = {};

  if (!email) {
    errors.email = "Email is required.";
  } else if (!validator.isEmail(email)) {
    errors.email = "Email is not valid.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Login Failed",
      error: "Invalid Credentials",
    });
  }

  next();
}

function validateUserData(req, res, next) {
  const { name, email, password, phoneNumber, location } = JSON.parse(req.body);
  const errors = {};

  if (!name) {
    errors.name = "Name is required.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!validator.isEmail(email)) {
    errors.email = "Email is not valid.";
  }

  if (
    !password ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    )
  ) {
    errors.password =
      "Password must contain at least 8 characters with 1 lowercase, 1 uppercase, 1 number, and 1 symbol.";
  }

  if (!phoneNumber) {
    errors.phoneNumber = "Phone number is required.";
  } else if (phoneNumber.length != 11) {
    errors.phoneNumber = "Phone number must be 11 digits.";
  }

  if (!location) {
    errors.location = "Location is required.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Register Failed",
      errors: errors,
    });
  }

  next();
}

function validateRestaurantData(req, res, next) {
  const {
    name,
    location,
    openHours,
    contactNumber,
    deliveryOptions,
    owner,
    email,
    password,
  } = JSON.parse(req.body);

  const errors = {};

  if (
    !deliveryOptions ||
    !deliveryOptions.deliveryFee ||
    deliveryOptions.deliveryFee > 100
  ) {
    errors.deliveryFee = "Delivery fee should be provided and not exceed 100.";
  }

  if (!deliveryOptions || !deliveryOptions.deliveryArea) {
    errors.deliveryArea = "Delivery area is required.";
  }

  if (!name) {
    errors.name = "Name is required.";
  }

  if (!location) {
    errors.location = "Location is required.";
  }

  if (!openHours) {
    errors.openHours = "Open hours are required.";
  }

  if (
    !contactNumber ||
    !validator.isMobilePhone(contactNumber, "any", { strictMode: false })
  ) {
    errors.contactNumber =
      "Contact number is required and must be a valid phone number.";
  }

  if (!email || !validator.isEmail(email)) {
    errors.email = "Email is required and must be a valid email address.";
  }

  if (
    !password ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    )
  ) {
    errors.password =
      "Password must contain at least 8 characters with 1 lowercase, 1 uppercase, 1 number, and 1 symbol.";
  }

  if (!owner) {
    errors.owner = "Owner is required.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Register Failed",
      errors: errors,
    });
  }

  next();
}

function validateToken(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return failure(res, 401, "Error Occurred", "Authentication required");
  }
}

module.exports = { validateSignupData, validateLoginData, validateToken };
