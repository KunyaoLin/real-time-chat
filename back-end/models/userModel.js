const moongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const validator = require("validator");
//写user model 的结构 其中包括用户名，密码，密码确认，邮箱，头像,权限，创建时间，状态，密码重设token，密码重设过期
const userSchema = new moongoose.Schema({
  username: {
    type: String,
    required: [true, "userName is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    validate: [validator.isEmail, ""],
  },
  avator: {},
  role: {},
  password: {},
  passwordComfirmed: {},
  createAt: {},
  active: {},
});
