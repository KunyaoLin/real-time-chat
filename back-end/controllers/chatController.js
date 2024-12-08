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
  try {
    const sendTo = await User.findOne({
      email: messageObj.receiverEmail,
    });
    console.log("sendTo:", sendTo);
    if (!sendTo) throw new Error("No User found, send message error!");
    const checkFriendExist = await Friends.find({
      friends: {
        $all: [req.user._id, sendTo._id],
      },
      status: "actived",
    });
    if (!checkFriendExist)
      return res.status(400).json({
        error: "You are blocked by this email,send message error",
      });
    const result = await ChatHistory.findOneAndUpdate(
      {
        participants: {
          $all: [req.user._id, sendTo._id],
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
    if (!result) {
      const newChat = await ChatHistory.create({
        participants: [req.user._id, sendTo._id],
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
    res.status(200).json({ message: "message send successfully" });

    // console.log("result:", result);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err,
    });
  }

  // const friendInfo = await User.find({
  //   email: messageObj.receiverEmail,
  // });

  // io.emit("message", message);
  // console.log(`${req.user.username}:`, message);
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
  const loginUserAvatar = req.user.avatar;
  const loginUserInfo = [loginUserEmail, loginUserAvatar];
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
    loginUserInfo,
    results,
    message: "All related chat history fetch success",
  });
});

exports.setAllMesgRead = catchAsync(async (req, res) => {
  const result = await ChatHistory.updateMany(
    {
      participants: {
        $all: [req.user._id, req.body.FriendInfo._id],
      },
    },
    {
      $set: {
        "messages.$[].isRead": true,
      },
    }
  );
  console.log("result:", result);
  if (result) {
    return res.status(200).json({
      message: "All messages are read",
      data: result,
    });
  }
  res.status(200).json({
    message: "No unread message found",
    // data: result,
  });
});

exports.getAllUnreadMegsNum = catchAsync(async (req, res) => {
  let unReadMegs = 0;
  const allMegsRec = await ChatHistory.find({
    participants: req.user._id,
  });
  allMegsRec.forEach((el) => {
    el.messages.forEach((x) => {
      if (!x.isRead) unReadMegs++;
    });
  });
  console.log("unReadMegs:", unReadMegs);

  res.status(200).json({
    message: "Sent all unread Messages",
    data: { unReadMegs },
  });
});
