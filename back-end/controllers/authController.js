const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const signToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRECT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};
const createSendToken = (req, res, next) => {};
//signToken and createSendToken
//create
//login
//logout
//signup
//update password
//forget password
//reset password
