const mongoose = require("mongoose");
const validator = require("validator");

const ChatHistorySchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
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
  status: {
    type: String,
    required: [true, "need to set status"],
    enum: ["active", "block"],
    default: "active",
  },
});
const ChatHistory = mongoose.model("ChatHistory", ChatHistorySchema);
module.exports = ChatHistory;
