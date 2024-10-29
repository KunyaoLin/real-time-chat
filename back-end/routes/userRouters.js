const express = require("express");
const userController = require("../controllers/userController");
const userRoute = express.Router({ mergeParams: true });
userRoute.route("/", userController.getMe);
