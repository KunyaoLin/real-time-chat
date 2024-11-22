const mongoose = require("mongoose");
const validator = require("validator");

const ChatHistorySchema = new mongoose.Schema({
  participants: {
    type: [String],
    required: true,
  },
  messages: [
    {
      senderEmail: {
        type: String,
        validate: [validator.isEmail],
        required: true,
      },
      receiverEmail: {
        type: String,
        validate: [validator.isEmail],
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      timeStamp: {
        type: Date,
        default: Date.now(),
      },
      isRead: {
        type: Boolean,
        default: false,
      },
    },
  ],
});
const ChatHistory = mongoose.model("ChatHistory", ChatHistorySchema);
module.exports = ChatHistory;
