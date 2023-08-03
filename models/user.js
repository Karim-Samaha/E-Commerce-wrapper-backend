const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: [4, "Name has to be at leaset 4 char"],
    maxLength: [20, "Name has to be under 20 char"],
  },
  email: {
    type: String,
    required: [true, "Email Is Required"],
    unique: true,
    validate: [validator.isEmail, "Email Should be valid"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
    minLength: [8, "Password Length has to be 8 or more"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Password is required"],
    select: false,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Confirm password has to match password field",
    },
  },
  emailVerifictaion: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Bcrypt Password
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.checkPassword = async (userPass, reqPass) => {
  return await bcrypt.compare(userPass, reqPass);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
