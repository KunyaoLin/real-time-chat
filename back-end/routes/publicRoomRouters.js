const express = require("express");
const publicRoomController = require("../controllers/publicRoomController");
const publicRoute = express.Router({ mergeParams: true });

publicRoute.route("/").get(publicRoomController.getMessages);
publicRoute.route("/api/broadcast").post(publicRoomController.sendMessage);
module.exports = publicRoute;
