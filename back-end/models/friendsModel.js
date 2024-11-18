const mongoose = require("mongoose");
const FriendsSchema = new mongoose.Schema(
  {
    friends: {
      type: [String],
    },
    status: {
      type: String,
      enum: ["actived", "Blocked"],
      default: "actived",
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    blockd_by: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);
const Friends = mongoose.model("Friends", FriendsSchema);
module.exports = Friends;
