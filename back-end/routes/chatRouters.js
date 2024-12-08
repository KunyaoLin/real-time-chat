const express = require("express");
const chatRoute = express.Router({ mergeParams: true });
const chatController = require("../controllers/chatController");
const authController = require("../controllers/authController");
chatRoute.use("/", authController.protectTo);
chatRoute.route("/getChatRecord").get(chatController.getChatRecord);

chatRoute.route("/sendMessage").post(chatController.sendMessage);
chatRoute.route("/setAllMesgRead").post(chatController.setAllMesgRead);
chatRoute.route("/getAllUnreadMegsNum").get(chatController.getAllUnreadMegsNum);

module.exports = chatRoute;
