const express = require("express");
const chatRoute = express.Router({ mergeParams: true });
const chatController = require("../controllers/chatController");

chatRoute.route("/").get(chatController.getMessages);
chatRoute.route("/api/broadcast").post(chatController.sendMessage);
module.exports = chatRoute;
