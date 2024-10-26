const express = require("express");
const privateControllers = require("../controllers/privateRoomController");
const privateRoute = express.Router({ mergeParams: true });
privateRoute.route("/:Id").get(privateControllers.getPrivateMes);
module.exports = privateRoute;
