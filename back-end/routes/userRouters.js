const express = require("express");
const userController = require("../controllers/userController");
const chatController = require("../controllers/chatController");
const authController = require("../controllers/authController");
const userRoute = express.Router({ mergeParams: true });
userRoute.route("/login").post(authController.login);
userRoute.route("/signup").post(authController.signup);
userRoute.route("/logout").get(authController.protectTo, authController.logout);
userRoute.route("/forgetPassword").post(authController.forgetPassword);
userRoute.route("/resetPassword/:token").patch(authController.resetPassword);

userRoute.use("/friends/request", authController.protectTo);
userRoute
  .route("/friends/request")
  .post(userController.sendFriendreq)
  .get(userController.getAllFriendsReq);
userRoute.route("/friends/request/accept").patch(userController.acceptFriend);
userRoute.route("/").post(authController.login);
// userRoute.use(authController.protectTo);
module.exports = userRoute;
