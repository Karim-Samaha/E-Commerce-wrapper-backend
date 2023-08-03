const catchAsync = require("../utilities/catchAsync");
const User = require("../models/user");
const Email = require("../utilities/nodemiller");

exports.signIn = async (req, res, next) => {
  res.end(
    JSON.stringify({
      status: "success",
      data: [],
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
