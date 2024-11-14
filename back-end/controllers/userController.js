const { response } = require("express");
const Friends = require("../models/friendsModel");
const User = require("../models/userModel");
const catchAsync = require("../ults/catchAsync");
exports.sendFriendreq = catchAsync(async (req, res) => {
  if (req.user.friends.includes(req.body.receiverEmail))
    return res.status(200).json({
      status: "success",
      message: "This user is already your friend",
    });
  const currentUser = req.user;
  const friend = await User.findOne({
    email: req.body.receiverEmail,
  });
  if (!friend)
    return res.status(404).json({
      status: "error",
      message: "User not Found or inactive",
    });
  const newFriendReq = await Friends.create({
    senderEmail: currentUser.email,
    receiverEmail: friend.email,
  });
  const result = await newFriendReq.save();
  console.log(result);
  res.status(200).json({
    status: "friend request success",
    result,
  });
  //   const { _id } = req.user;
});
exports.getAllFriendsReq = catchAsync(async (req, res, next) => {
  const allReq = await Friends.find({
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
  const friendReq = await Friends.findOne({
    senderEmail: req.body.senderEmail,
    receiverEmail: req.user.email,
    status: "pending",
  });
  console.log(friendReq);
  if (!friendReq)
    return res.status(401).json({
      status: "error",
      message: "accept friend request error",
    });
  try {
    req.user.friends.push(req.body.senderEmail);
    await req.user.save();
    const friend = await User.findOneAndUpdate(
      { email: req.body.senderEmail },
      {
        $addToSet: { friends: req.user.email },
      },
      { new: true, runValidators: true }
    );
    console.log(friend);
    await Friends.findOneAndUpdate(
      {
        senderEmail: req.body.senderEmail,
        receiverEmail: req.user.email,
      },
      {
        status: "accepted",
      },
      {
        new: true,
      }
    );
    if (friend)
      res.status(200).json({
        status: "success",
        message: "add friend success",
      });
    else {
      throw new Error("add friend error");
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
});
exports.deleteFriend = catchAsync(async (req, res, next) => {
  const resultOne = await Friends.deleteOne({
    userId: req.user._id,
    friendId: req.body,
  });
  console.log(resultOne);
  const resultTwo = await Friends.deleteOne({
    userId: req.body.friendId,
    friendId: req.user._id,
  });
  console.log(resultTwo);
  if (!resultOne && !resultTwo)
    return res.status(404).json({
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
    $or: [
      { UserId: req.user._id },
      {
        friendId: req.user._id,
      },
    ],
  });
  if (!FriendList)
    return res.status(200).json({
      status: "success",
      message: "No friends on your contact",
    });
  res.status(200).json({
    status: "success",
    message: "All friends load to your contact",
    data: {
      FriendList,
    },
  });
});

exports.getMe = (req, res, next) => {};
