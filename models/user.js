const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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
  mailVirficationToken: String,
  mailVirficationTokenExpiry: String,
  resetPasswordToken: String,
  resetPasswordExpiry: String,
});

// Bcrypt Password
userSchema.pre("save", async function (next) {
  // Will Run First Time Before Mail virefication
  if (!this.emailVerifictaion) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
    const virficationToken = await crypto.randomBytes(32).toString("hex");
    this.mailVirficationToken = virficationToken;
    this.mailVirficationTokenExpiry = Date.now() + 2 * 60 * 60 * 1000;
  } else if (this.resetPasswordToken && this.confirmPassword) {
    console.log("this runed");
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
  }
  next();
});

// Check Password
userSchema.methods.checkPassword = async (reqPass, userPass) => {
  return await bcrypt.compare(reqPass, userPass);
};

// Mail Verfication

userSchema.methods.resendMailVirfication = async () => {
  const virficationToken = await crypto.randomBytes(32).toString("hex");
  this.mailVirficationToken = virficationToken;
  this.mailVirficationTokenExpiry = Date.now() + 2 * 60 * 60 * 1000;
  return virficationToken;
};

userSchema.methods.resetPassword = async function () {
  const resetToken = await crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpiry = Date.now() + 2 * 60 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
