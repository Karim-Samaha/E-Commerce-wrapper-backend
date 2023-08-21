const catchAsync = require("../utilities/catchAsync");
const User = require("../models/user");
const Email = require("../utilities/nodemiller");
const Error = require("../utilities/appError");
const jwt = require("jsonwebtoken");

exports.signIn = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(new Error(500, "Email & Password are required"));
  }
  const user = await User.findOne({ email: req.body.email }).select(
    "password email emailVerifictaion mailVirficationToken mailVirficationTokenExpiry"
  );
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
  if (!user.emailVerifictaion) {
    // const link = await user.makeVerficationMailToken();
    res.status(200).end(
      JSON.stringify({
        status: "EMAIL_NOT_VERFIED",
        link: `https://localhost:8000/api/vi/${user._id}/${user.mailVirficationToken}`,
      })
    );
    return;
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
      link: `https://localhost:8000/api/vi/${newUser._id}/${newUser.mailVirficationToken}`,
    })
  );
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (req.params.virficationToken !== user.mailVirficationToken) {
    return next(new Error(500, "Unvalid verfication token"));
  }
  if (Date.now() > user.mailVirficationTokenExpiry) {
    return next(
      new Error(
        500,
        "Link has been Expired, Please login with your credtinals and resend the virfication mail"
      )
    );
  }

  user.emailVerifictaion = true;
  user.mailVirficationTokenExpiry = undefined;
  user.mailVirficationToken = undefined;
  await user.save({ new: false, validateBeforeSave: false });
  res.status(200).end(
    JSON.stringify({
      status: "success",
      message: "Email Has been verfied, you can login in now",
    })
  );
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const email = await req.body.email;
  if (!email) {
    return next(new Error(500, "Email Is Required for reseting password"));
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new Error(500, "Email was not found"));
  }
  await user.resetPassword();
  await user.save({ new: false, validateBeforeSave: false });
  await new Email(email, null, null).sendResetPasswordEmail();
  res.status(200).end(
    JSON.stringify({
      status: "success",
      user: user,
    })
  );
});

exports.changePasswordFromReset = catchAsync(async (req, res, next) => {
  const { resetPasswordToken, resetPasswordExpiry, newPassword } =
    await req.body;
  let user = await User.findOne({ resetPasswordToken: resetPasswordToken });
  if (!user) {
    return next(new Error(500, "Reset Token was not found"));
  }
  if (Date.now() > resetPasswordExpiry) {
    return next(new Error(500, "Reset Token has expired"));
  }
  if (!newPassword) {
    return next(new Error(500, "New Password is Required"));
  }
  user.password = newPassword;
  user.confirmPassword = newPassword;
  await user.save({ new: false });
  res.status(200).end(
    JSON.stringify({
      status: "success",
    })
  );
});
