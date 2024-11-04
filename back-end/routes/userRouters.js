const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const userRoute = express.Router({ mergeParams: true });
userRoute.route("/login").post(authController.login);
userRoute.route("/signup").post(authController.signup);

module.exports = userRoute;
