const catchAsync = require("../utilities/catchAsync");
const User = require("../models/user");
const Email = require("../utilities/nodemiller");
const Error = require("../utilities/appError");
const jwt = require("jsonwebtoken");

exports.signIn = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(new Error(500, "Email & Password are required"));
  }
  const user = await User.findOne({ email: req.body.email }).select("password");
  if (!user) {
    return next(new Error(500, "No User with That Email was found"));
  }
  const isPasswordRight = await user.checkPassword(
    req.body.password,
    user.password
  );
  if (!isPasswordRight) {
    return next(new Error(500, "Wrong Password"));
  }
  const userToken = await jwt.sign(
    {
      user_id: user._id,
    },
    `${process.env.JWT_SECRET_KEY}`,
    {
      expiresIn: `${process.env.JWT_EXPIRY}`,
    }
  );
  res.status(200).end(
    JSON.stringify({
      status: "success",
      userToken,
    })
  );
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  await new Email(newUser.email, null, null).sendConfirmEmail();
  res.status(201).end(
    JSON.stringify({
      status: "success",
      user: newUser.email,
    })
  );
});
