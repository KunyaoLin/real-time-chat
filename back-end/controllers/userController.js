const FriendReq = require("../models/friendReqModel");
const Friends = require("../models/friendsModel");
const User = require("../models/userModel");
const catchAsync = require("../ults/catchAsync");
exports.sendFriendreq = catchAsync(async (req, res) => {
  //check received Email whether is a friend or not
  const checkFriend = await Friends.find({
    friends: {
      $all: [`${req.user.email}`, `${req.body.receiverEmail}`],
    },
  });
  console.log("checkFriend", checkFriend, checkFriend.length);
  if (checkFriend.status === "blocked")
    return res.status(401).json({
      message: "Send friend request error, You was blocked by this email",
    });
  if (checkFriend.length !== 0)
    return res.status(200).json({
      message: "This user is already your friend",
    });
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
  const friend = await User.findOne({
    email: `${req.body.receiverEmail}`,
  });
  if (!friend)
    return res.status(500).json({
      status: "error",
      message: "User not Found or inactive",
    });
  try {
    const newFriendReq = await FriendReq.create({
      senderEmail: currentUser.email,
      receiverEmail: friend.email,
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

    const addFriend = await Friends.create({
      friends: [`${req.user.email}`, `${req.body.senderEmail}`],
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

exports.deleteFriend = catchAsync(async (req, res, next) => {
  const friDelete = await Friends.findOneAndDelete({
    friends: { $all: [`${req.user.email}`, `${req.body.deleteEmail}`] },
  });
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
  if (!friDelete || !reqDelete)
    return res.status(500).json({
      status: "error",
      message: "Delete friend error",
    });
  res.status(200).json({
    status: "success",
    message: "Delete friend success",
  });
});

exports.getAllFriends = catchAsync(async (req, res, next) => {
  const FriendList = await Friends.find({
    friends: `${req.user.email}`,
  });
  if (FriendList.length === 0)
    return res.status(200).json({
      status: "success",
      message: "No friends on your contact,please add some friends!",
    });
  res.status(200).json({
    status: "success",
    message: "All friends load to your contact",
    data: {
      FriendList,
    },
  });
});
exports.blockFriend = catchAsync(async (req, res) => {
  try {
    const blockResult = await Friends.findOneAndUpdate(
      {
        friends: {
          $all: [`${req.user.email}`, `${req.body.blockEmail}`],
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
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});
exports.unblockFriend = catchAsync(async (req, res) => {
  try {
    const unblockResult = await Friends.findOneAndUpdate(
      {
        $and: [
          {
            friends: {
              $all: [`${req.user.email}`, `${req.body.unblockEmail}`],
            },
          },
          {
            status: "blocked",
          },
        ],
      },
      {
        status: "actived",
        blockd_by: null,
      }
    );
    console.log(unblockResult);
    if (!unblockResult) throw new Error("unblock friend error");
    res.status(200).json({
      status: "success",
      message: "unblock friend success",
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});
exports.getMe = (req, res, next) => {};
