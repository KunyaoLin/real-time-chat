const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please input a room name before create"],
    },
    type: {
      type: String,
      required: [true, "the type of room is require"],
      enum: ["private", "public"],
      default: "public",
    },
    message: [
      {
        type: String,
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: String,
        timeStamp: { type: Date, default: Date.now() },
        isRead: { type: Boolean, default: false },
      },
    ],
    accessLevel: {
      type: String,
      enum: ["regular", "VIP"],
      default: "regular",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false }
);
const Room = mongoose.Model("Room", roomSchema);
module.exports = Room;
