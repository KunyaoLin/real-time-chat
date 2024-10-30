const moongoose = require("mongoose");
const roomSchema = new moongoose.Schema({
  name: {
    type: String,
    required: [true, "please input a room name before create"],
  },
});
