const ChatHistory = require("../models/chatHistoryModel");
const Friends = require("../models/friendsModel");
const User = require("../models/userModel");
const catchAsync = require("../ults/catchAsync");

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { messageObj } = req.body;
  if (!messageObj)
    return res.status(400).json({
      error: "Message content is required",
    });
  const checkFriendExist = await Friends.find({
    friends: {
      $all: [req.user.email, messageObj.receiverEmail],
    },
    status: "actived",
  });
  if (!checkFriendExist)
    return res.status(400).json({
      error: "You are blocked by this email,send message error",
    });
  const friendInfo = await User.find({
    email: messageObj.receiverEmail,
  });

  const result = await ChatHistory.findOneAndUpdate(
    {
      participants: {
        $all: [req.user._id, friendInfo[0]._id],
      },
    },
    {
      $push: {
        messages: {
          senderEmail: req.user.email,
          receiverEmail: messageObj.receiverEmail,
          message: messageObj.message,
          timeStamp: Date.now(),
        },
      },
    },
    { new: true }
  );
  console.log("result:", result);
  if (!result) {
    const newChat = await ChatHistory.create({
      participants: [req.user._id, friendInfo[0]._id],
      messages: [
        {
          senderEmail: messageObj.senderEmail,
          receiverEmail: messageObj.receiverEmail,
          message: messageObj.message,
        },
      ],
    });
    console.log(newChat);
    return res.status(200).json({
      status: "success",
      message: "message send success successfully",
      data: newChat,
    });
  }
  // io.emit("message", message);
  // console.log(`${req.user.username}:`, message);
  res.status(200).json({ message: "message send successfully" });
});
exports.getMessages = (req, res, next) => {
  const { message } = req.body;
  //   if (!message) return next();
  res.status(200).json({
    status: "success",
    message: "get message",
    data: { message },
  });
};
exports.getChatRecord = catchAsync(async (req, res) => {
  const loginUserEmail = req.user.email;
  const results = await ChatHistory.find({
    participants: {
      $in: [req.user._id],
    },
  })
    .populate("participants", "username avatar email onlineStatus")
    .exec();
  if (!results)
    return res.status(404).json({
      message: "No related chat history found",
    });

  res.status(200).json({
    status: "success",
    // allUsers,
    loginUserEmail,
    results,
    message: "All related chat history fetch success",
  });
});
