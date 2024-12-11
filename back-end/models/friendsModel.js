const mongoose = require("mongoose");
const FriendsSchema = new mongoose.Schema(
  {
    // friends: {
    //   type: [String],
    //   // ref: "User",
    // },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["actived", "blocked"],
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
