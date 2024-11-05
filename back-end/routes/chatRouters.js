const express = require("express");
const chatRoute = express.Router({ mergeParams: true });
const chatController = require("../controllers/chatController");
const authController = require("../controllers/authController");

chatRoute.route("/api/broadcast").post(chatController.sendMessage);
module.exports = chatRoute;
