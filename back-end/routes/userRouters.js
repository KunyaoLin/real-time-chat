const express = require("express");
const userRoute = express.Router({ mergeParams: true });
userRoute.route("/");
