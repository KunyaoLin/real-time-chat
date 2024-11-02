const moongoose = require("mongoose");
const roomSchema = new moongoose.Schema({
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
      sender: { type: moongoose.Schema.Types.ObjectId, ref: "User" },
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
    type: moongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  member: {
    type: moongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});
const Room = moongoose.Model("Room", roomSchema);
module.exports = Room;
