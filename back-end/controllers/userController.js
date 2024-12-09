const mongoose = require("mongoose");
const ChatHistory = require("../models/chatHistoryModel");
const FriendReq = require("../models/friendReqModel");
const Friends = require("../models/friendsModel");
const User = require("../models/userModel");
const catchAsync = require("../ults/catchAsync");
exports.sendFriendreq = catchAsync(async (req, res) => {
  const searchFri = await User.findOne({ email: req.body.receiverEmail });
  //check received Email whether is a friend or not
  if (searchFri) {
    const checkFriend = await Friends.find({
      friends: {
        $all: [`${req.user._id}`, `${searchFri._id}`],
      },
    });
    if (checkFriend.status === "blocked")
      return res.status(401).json({
        message: "Send friend request error, You was blocked by this email",
      });
    if (checkFriend.length !== 0)
      return res.status(200).json({
        message: "This user is already your friend",
      });
    console.log("checkFriend", checkFriend, checkFriend.length);
    const friReq = await FriendReq.findOne({
      receiverEmail: req.body.receiverEmail,
      status: "pending",
    });
    if (friReq)
      return res.status(200).json({
        message:
          "You already send friend request to this email account! please wait for response from your friend.",
      });
    const currentUser = req.user;

    try {
      const newFriendReq = await FriendReq.create({
        senderEmail: currentUser.email,
        receiverEmail: searchFri.email,
      });
      if (newFriendReq)
        res.status(200).json({
          status: "success",
          message: "send friend request success",
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "send friend request fail",
      });
    }
  }

  // const friend = await User.findOne({
  //   email: `${req.body.receiverEmail}`,
  // });
  // if (!friend)
  //   return res.status(500).json({
  //     status: "error",
  //     message: "User not Found or inactive",
  //   });
});
exports.getAllFriendsReq = catchAsync(async (req, res, next) => {
  const allReq = await FriendReq.find({
    receiverEmail: req.user.email,
    status: "pending",
  });
  if (!allReq || allReq.length === 0)
    return res.status(200).json({
      message: "No friend request found",
    });
  res.status(200).json({
    status: "success",
    message: "Friend request found",
    data: { allReq },
  });
});
exports.acceptFriend = catchAsync(async (req, res) => {
  if (!/^\S+@\S+\.\S+$/.test(req.body.senderEmail)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid email format",
    });
  }

  try {
    const friendReq = await FriendReq.findOneAndUpdate(
      {
        senderEmail: req.body.senderEmail,
        receiverEmail: req.user.email,
        status: "pending",
      },
      {
        status: "accepted",
        $unset: { expiresAt: "" },
      },
      {
        new: true,
      }
    );
    if (!friendReq) throw new Error("accept friend request error");
    const friendInfo = await User.findOne({
      email: req.body.senderEmail,
    });
    const addFriend = await Friends.create({
      friends: [`${req.user._id}`, `${friendInfo._id}`],
    });
    if (!addFriend) throw new Error("add Friend error");
    res.status(200).json({
      status: "success",
      message: "Accept friend request successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
});
exports.rejectFriendReq = catchAsync(async (req, res) => {
  try {
    const friendReq = await FriendReq.findOneAndUpdate(
      {
        senderEmail: `${req.body.rejectEmail}`,
      },
      {
        status: "rejected",
      }
    );
    if (!friendReq) throw new Error("reject friend request error");
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: `"Reject friend Request Error",${err} `,
    });
  }
});

exports.deleteFriend = catchAsync(async (req, res) => {
  const DeleteAcc = await User.findOne({
    email: req.body.deleteEmail,
  });
  // console.log("DeleteAcc", DeleteAcc._id);
  // console.log("user", req.user._id);
  if (DeleteAcc) {
    const friDelete = await Friends.findOneAndDelete({
      friends: {
        $all: [req.user._id, DeleteAcc._id],
      },
    });
    console.log(friDelete);
    const reqDelete = await FriendReq.findOneAndDelete({
      $or: [
        {
          $and: [
            { senderEmail: `${req.user.email}` },
            { receiverEmail: `${req.body.deleteEmail}` },
          ],
        },
        {
          $and: [
            { senderEmail: `${req.body.deleteEmail}` },
            { receiverEmail: `${req.user.email}` },
          ],
        },
      ],
    });
    const result = await ChatHistory.findOneAndDelete({
      participants: { $all: [`${req.user._id}`, `${DeleteAcc._id}`] },
    });
    if (!friDelete || !reqDelete) {
      return res.status(500).json({
        status: "error",
        message: "Delete friend error",
        data: {
          friDelete,
          reqDelete,
          result,
        },
      });
    }
    // console.log("result", result);
  }

  res.status(200).json({
    status: "success",
    message: "Delete friend success",
  });
});

exports.getAllFriends = catchAsync(async (req, res, next) => {
  const FriendList = await Friends.find({
    friends: `${req.user._id}`,
  }).populate("friends");
  if (FriendList.length === 0) {
    return res.status(200).json({
      status: "success",
      message: "No friends on your contact,please add some friends!",
    });
  } else {
    console.log("FriendList", FriendList);
    const FriendsContact = FriendList.map((el) => {
      const result = el.friends.filter((el) => el.email !== req.user.email);
      console.log("result", result);
      return { ...el, friends: result };
    });
    console.log("FriendsContact", FriendsContact);
    res.status(200).json({
      status: "success",
      message: "All friends load to your contact",
      data: {
        FriendsContact,
      },
    });
  }
});
exports.blockFriend = catchAsync(async (req, res) => {
  try {
    const blockAcc = await User.findOne({
      email: req.body.blockEmail,
    });
    if (blockAcc) {
      const blockResult = await Friends.findOneAndUpdate(
        {
          friends: {
            $all: [req.user._id, blockAcc._id],
          },
        },
        {
          status: "blocked",
          blockd_by: `${req.user.email}`,
        }
      );
      console.log(blockResult);
      if (!blockResult) throw new Error("Block friend error");
      res.status(200).json({
        status: "success",
        message: "block friend success",
      });
    }
    if (!blockAcc)
      return res.status(500).json({
        message: "block friend err",
      });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});
exports.unblockFriend = catchAsync(async (req, res) => {
  try {
    const unblockAcc = await User.findOne({
      email: req.body.unblockEmail,
    });
    if (unblockAcc) {
      const unblockResult = await Friends.findOneAndUpdate(
        // {
        //   $and: [
        //     {
        //       friends: {
        //         $all: [`${req.user.email}`, `${req.body.unblockEmail}`],
        //       },
        //     },
        //     {
        //       status: "blocked",
        //     },
        //   ],
        // },
        {
          friends: {
            $all: [req.user._id, unblockAcc._id],
          },
          status: "blocked",
        },
        {
          status: "actived",
          blockd_by: null,
        }
      );
      if (!unblockResult) throw new Error("block friend error");
      console.log("unblockResult", unblockResult);

      res.status(200).json({
        status: "success",
        message: "unblock friend success",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});
exports.getMe = (req, res, next) => {};
