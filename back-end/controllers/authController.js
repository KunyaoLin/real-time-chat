const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../ults/catchAsync");
const signToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRECT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  req.cookie("jwt", token, {
    expires: new Date(
      Date.now + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.header["x-forwarded-proto"] === "https", //when server run in http,req.secure return true
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
//signToken and createSendToken
//signup
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.emai,
    password: req.body.password,
    passwordComfirmed: req.body.passwordComfirmed,
  });
  createSendToken(newUser, 200, req, res);
  // add send email to recipient function
});
//login
//logout
//update password
//forget password
//reset password
