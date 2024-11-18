const mongoose = require("mongoose");
const FriendReqSchema = new mongoose.Schema(
  {
    senderEmail: {
      type: String,
      ref: "User",
      required: [true, "Friend request need an sender"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid sender email address"],
    },
    receiverEmail: {
      type: String,
      ref: "User",
      required: [true, "Need a receiver Email address"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid receiver email address"],
    },
    status: {
      type: String,
      required: [true, "Friend relationship need a status"],
      enum: ["pending", "accepted", "rejected", "invalided"],
      default: "pending",
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    expiresAt: {
      type: Date,
      requird: true,
      default: Date.now() + 24 * 7 * 60 * 60 * 1000,
      index: { expires: 0 },
    },
  },
  { versionKey: false }
);
//revoke friend request
FriendReqSchema.pre(/^find/, async function (next) {
  this.find({
    createAt: { $gt: Date.now() - 24 * 60 * 60 * 1000 },
  });
  next();
});

const FriendReq = mongoose.model("FriendReq", FriendReqSchema);
module.exports = FriendReq;
