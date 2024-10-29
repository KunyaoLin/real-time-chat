exports.sendMessage = (req, res, next) => {
  const io = req.app.get("io");
  const { message } = req.body;
  if (!message)
    return res.status(400).json({
      error: "Message content is required",
    });
  io.emit("message", message);
  console.log("Broadcast message from API", message);
  res.status(200).json({ status: "Message broadcast successfully" });
};
exports.getMessages = (req, res, next) => {
  const { message } = req.body;
  //   if (!message) return next();
  res.status(200).json({
    status: "success",
    message: "get message",
    data: { message },
  });
};
