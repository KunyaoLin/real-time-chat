const mongoose = require("mongoose");
const ChatHistory = require("../models/chatHistoryModel");
const FriendReq = require("../models/friendReqModel");
const Friends = require("../models/friendsModel");
const User = require("../models/userModel");
const catchAsync = require("../ults/catchAsync");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
exports.sendFriendreq = catchAsync(async (req, res) => {
  const searchFri = await User.findOne({ email: req.body.receiverEmail });
  //check received Email whether is a friend or not
  if (searchFri) {
    // const checkFriend = await Friends.find({
    //   friends: {
    //     $all: [`${req.user._id}`, `${searchFri._id}`],
    //   },
    // });
    // if (checkFriend.status === "blocked")
    //   return res.status(401).json({
    //     message: "Send friend request error, You was blocked by this email",
    //   });
    // if (checkFriend.length !== 0)
    //   return res.status(200).json({
    //     message: "This user is already your friend",
    //   });
    // console.log("checkFriend", checkFriend, checkFriend.length);

    const currentUser = req.user;

    try {
      const newFriendReq = await FriendReq.create({
        senderEmail: currentUser.email,
        senderId: req.user._id,
        receiverEmail: searchFri.email,
      });
      if (newFriendReq)
        res.status(200).json({
          status: "success",
          message: "send friend request success",
        });
    } catch (err) {
      // console.log(err);
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
exports.checkFriReq = catchAsync(async (req, res) => {
  const friReq = await FriendReq.find({
    // senderEmail: `${req.body.receiverEmail}`,
    $or: [
      {
        receiverEmail: req.body.me,
        senderEmail: req.body.target,
        status: "pending",
      },
      {
        receiverEmail: req.body.target,
        senderEmail: req.body.me,
        status: "pending",
      },
    ],
  });
  // console.log("memememe", req.body.me);
  // console.log("friReqfriReqfriReq", friReq);
  if (friReq.length === 0) {
    return res.status(200).json({
      status: "noneSend",
      data: { friReq },
    });
  }
  if (friReq[0].status === "pending") {
    return res.status(200).json({
      status: "pending",
      message:
        "You already send friend request to this email account! please wait for response from your friend.",
      data: { friReq },
    });
  } else if (friReq[0].status === "accepted") {
    return res.status(200).json({
      status: "accepted",
      data: { friReq },
    });
  } else {
    res.status(200).json({
      status: friReq.status,
      data: { friReq },
    });
  }
});
exports.getAllFriendsReq = catchAsync(async (req, res, next) => {
  const allReq = await FriendReq.find({
    receiverEmail: req.user.email,
    status: "pending",
  }).populate("senderId");
  // console.log("allReq:", allReq);

  if (!allReq || allReq.length === 0)
    return res.status(200).json({
      message: "No friend request found",
      data: {},
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
    const WelMegs = await ChatHistory.create({
      participants: [req.user._id, req.body.senderId],
      messages: {
        senderEmail: req.body.senderEmail,
        receiverEmail: req.user.email,
        message: "Nice to see you",
      },
    });
    if (!addFriend || !WelMegs) throw new Error("add Friend error");
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
        receiverEmail: req.user.email,
        status: "pending",
      },
      {
        status: "rejected",
      }
    );
    if (!friendReq) throw new Error("reject friend request error");
    return res.status(200).json({
      status: "rejected",
      friendReq,
    });
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

  if (DeleteAcc) {
    const friDelete = await Friends.findOneAndDelete({
      friends: {
        $all: [req.user._id, DeleteAcc._id],
      },
    });
    // console.log(friDelete);
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
    const removeBlock = await User.findOneAndUpdate(
      {
        email: req.user.email,
      },
      { $pull: { blockList: DeleteAcc._id } }
    );
    if (!friDelete || !reqDelete || !removeBlock) {
      return res.status(500).json({
        status: "error",
        message: "Delete friend error",
        data: {
          friDelete,
          reqDelete,
          result,
          removeBlock,
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
  }).populate({
    path: "friends",
    select: "username email avatar role onlineStatus blockList",
  });
  if (FriendList.length === 0) {
    return res.status(200).json({
      status: "success",
      message: "No friends on your contact,please add some friends!",
      data: { FriendsContact: [] },
    });
  } else {
    // console.log("FriendList", FriendList);
    const FriendsContact = FriendList.map((el) => {
      const result = el.friends.filter((el) => el.email !== req.user.email);

      if (el.blockd_by !== null && el.blockd_by !== req.user.email) {
        return { ...el, friends: [] };
      } else {
        return { ...el, friends: result };
      }
      // return { ...el, friends: result };
    });
    // console.log("FriendsContact", FriendsContact);
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
      const checkBlockList = await User.find({
        email: req.user.email,
        blockList: {
          $in: [blockAcc._id],
        },
      });
      if (checkBlockList.length > 0) {
        return res.status(500).json({
          message: "This account is on your block list",
          data: { checkBlockList },
        });
      }

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
      await User.findOneAndUpdate(
        {
          email: req.user.email,
        },
        {
          blockList: [...req.user.blockList, blockAcc._id],
        }
      );
      const blockChatRec = await ChatHistory.findOneAndUpdate(
        {
          participants: {
            $all: [req.user._id, blockAcc._id],
          },
        },
        {
          status: "block",
        }
      );
      // console.log(blockResult);
      if (!blockResult || !blockChatRec) throw new Error("Block friend error");
      res.status(200).json({
        status: "success",
        message: "block friend success",
        // data: { checkBlockList, length: checkBlockList.length },
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
      const unblock = await User.findOneAndUpdate(
        {
          email: req.user.email,
        },
        {
          blockList: req.user.blockList.filter((el) => {
            return !el.equals(unblockAcc._id);
          }),
        }
      );
      const unBlockChatRec = await ChatHistory.findOneAndUpdate(
        {
          participants: {
            $all: [req.user._id, unblockAcc._id],
          },
        },
        {
          status: "active",
        }
      );
      // console.log("unblockResult:", unblockResult);
      if (unblockResult === null) {
        return res.status(200).json({
          message: "This account is unblock by you",
        });
      }
      // console.log("unblockResult", unblockResult);

      res.status(200).json({
        status: "success",
        message: "unblock friend success",
        data: { unblock, unBlockChatRec },
      });
    }
    if (!unblockAcc) throw new Error("unblock error");
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});
exports.searchFriend = catchAsync(async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(200).json({ message: "Query parameter is required" });
  }
  const userFound = await User.find({
    username: query,
  }).populate("blockList");

  if (userFound.length === 0) {
    return res.status(200).json({
      message: "No User Found",
      data: {},
    });
  }

  res.status(200).json({
    message: "success",
    data: {
      userFound,
    },
  });
});
exports.getMe = catchAsync(async (req, res) => {
  const currentUser = await User.find({
    email: req.user.email,
  });
  if (currentUser.length !== 0)
    return res.status(200).json({
      message: "success",
      data: {
        currentUser,
      },
    });
});
exports.uploadAvatar = upload.single("avatar");
exports.saveAvatar = catchAsync(async (req, res) => {
  const file = req.file;
  if (!file)
    return res.status(404).json({
      message: "No avatar file found",
      status: "error",
    });

  const updateUser = await User.findOneAndUpdate(
    {
      email: req.user.email,
    },
    {
      avatar: {
        data: file.buffer,
        contentType: file.mimetype,
      },
    }
  );
  if (!updateUser) {
    return res.status(500).json({
      message: "update Avatart error",
      status: "error",
    });
  }

  res.status(200).json({
    status: "success",
    data: { updateUser },
  });
});

exports.updateUsername = catchAsync(async (req, res) => {
  const userUpdate = await User.findOneAndUpdate(
    {
      email: req.user.email,
    },
    {
      username: req.body.username,
    }
  );
  if (!userUpdate) {
    return res.status(500).json({
      status: "error",
      message: "update username error",
    });
  }
  return res.status(200).json({
    status: "success",
    data: {
      userUpdate,
    },
  });
});
