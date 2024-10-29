const express = require("express");
const privateChatController = require("../controllers/privateChatController");
const privateChatRoute = express.Router({ mergeParams: true });
privateChatRoute.route("/:Id").get(privateChatController.getPrivateMes);
module.exports = privateChatRoute;
