const ChatHistory = require("../models/chatHistoryModel");
const catchAsync = require("../ults/catchAsync");

exports.sendMessage = catchAsync(async (req, res, next) => {
  // const io = req.app.get("io");
  // console.log(io.id);
  const { messageObj } = req.body;
  if (!messageObj)
    return res.status(400).json({
      error: "Message content is required",
    });
  const result = await ChatHistory.findOneAndUpdate(
    {
      participants: {
        $all: [`${req.user.email}`, `${req.body.messageObj.receiverEmail}`],
      },
    },
    {
      $push: {
        messages: {
          senderEmail: req.user.email,
          receiverEmail: messageObj.receiverEmail,
          message: messageObj.message,
        },
      },
    },
    { new: true }
  );

  if (!result) {
    const newChat = await ChatHistory.create({
      participants: [
        `${req.user.email}`,
        `${req.body.messageObj.receiverEmail}`,
      ],
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
  const result = await ChatHistory.find({
    participants: {
      $in: [`${req.user.email}`],
    },
  });
  if (!result)
    return res.status(404).json({
      message: "No related chat history found",
    });

  res.status(200).json({
    status: "success",
    result,
    message: "All related chat history fetch success",
  });
});
