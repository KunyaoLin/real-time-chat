const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const userRoute = express.Router({ mergeParams: true });

// cosnt;
userRoute.route("/login").post(authController.login);
userRoute.route("/signup").post(authController.signup);
userRoute
  .route("/logout")
  .post(authController.protectTo, authController.logout);
userRoute.route("/forgetPassword").post(authController.forgetPassword);
userRoute.route("/resetPassword/:token").patch(authController.resetPassword);

userRoute.use("/friends", authController.protectTo);
userRoute.route("/friends/getAllFriends").get(userController.getAllFriends);
userRoute.route("/friends/blockFriend").patch(userController.blockFriend);
userRoute.route("/friends/unblockFriend").patch(userController.unblockFriend);

userRoute
  .route("/friends/request")
  .post(userController.sendFriendreq)
  .get(userController.getAllFriendsReq);

userRoute.route("/friends/checkReq").post(userController.checkFriReq);
userRoute.route("/friends/search").get(userController.searchFriend);
userRoute.route("/friends/request/accept").patch(userController.acceptFriend);
userRoute
  .route("/friends/request/reject")
  .patch(userController.rejectFriendReq);

userRoute.route("/friends/request/delete").patch(userController.deleteFriend);

userRoute.route("/getMe").get(authController.protectTo, userController.getMe);
userRoute.use("/setting", authController.protectTo);
userRoute
  .route("/setting/uploadAvatar")
  .post(userController.uploadAvatar, userController.saveAvatar);
userRoute.route("/setting/usernameUpdate").patch(userController.updateUsername);
userRoute.route("/setting/updatePassword").patch(authController.updatePassword);
userRoute.route("/").post(authController.login);
module.exports = userRoute;
