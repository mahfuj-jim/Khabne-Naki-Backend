const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is not provided"],
      validate: {
        validator: function (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is not provided"],
    },
    verified: {
      type: Boolean,
      required: [true, "Verified is not provided"],
    },
    role: {
      type: Number,
      enum: [1, 2], // 1 for user, 2 for restaurant
      required: [true, "Role is not provided"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: function () {
        return this.role === 1;
      },
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurants",
      required: function () {
        return this.role === 2;
      },
    },
  },
  {
    timestamps: true,
  }
);

const AuthModel = mongoose.model("auth", authSchema);

module.exports = AuthModel;
