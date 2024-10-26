const express = require("express");
const publicRoomController = require("../controllers/publicRoomController");
const publicRoute = express.Router({ mergeParams: true });
publicRoute
  .route("/")
  .get(publicRoomController.getMessages)
  .post(publicRoomController.sendMessage);
module.exports = publicRoute;
