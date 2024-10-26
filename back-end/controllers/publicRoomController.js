exports.sendMessage = (req, res, next) => {
  const { message } = req.body;
  if (!message) return next();
  res.status(200).json({
    status: "success",
    data: { message },
  });
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
