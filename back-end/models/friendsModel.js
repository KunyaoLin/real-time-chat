const mongoose = require("mongoose");
const FriendsSchema = new mongoose.Schema(
  {
    senderEmail: {
      type: String,
      ref: "User",
      required: [true, "Friend request need an sender"],
    },
    receiverEmail: {
      type: String,
      ref: "User",
      required: [true, "Need a receiver Email address"],
    },
    status: {
      type: String,
      required: [true, "Friend relationship need a status"],
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false }
);
//revoke friend request
FriendsSchema.pre(/^find/, async function (next) {
  this.find({
    createAt: { $gt: Date.now() - 24 * 60 * 60 * 1000 },
  });
  next();
});

const Friends = mongoose.model("Friends", FriendsSchema);
module.exports = Friends;
