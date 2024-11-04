const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const userRoute = express.Router({ mergeParams: true });
userRoute.route("/").post(authController.login);
module.exports = userRoute;
