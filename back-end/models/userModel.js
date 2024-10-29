const moongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { reset } = require("nodemon");
//bcrypt => password, crypto=>token

const userSchema = new moongoose.Schema({
  username: {
    type: String,
    required: [true, "userName is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    validate: [validator.isEmail, ""],
    unique: true,
  },
  avator: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "please provide your password"],
    minlength: 8,
    select: false,
  },
  passwordComfirmed: {
    type: String,
    require: [true, "please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangeAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  active: {
    type: Boolean,
    select: false,
    default: true,
  },
});
// this only work on user create or change password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordComfirmed = undefined;
  next();
});
//edit passwordChangeAt, only work on user create this model first time or change password. JWTStamp > passwordChangeAt, user need to login again
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangeAt = Date.now() - 1000; //minus one sec to make sure passwordChangeAt < JWTStamp
  next();
});
//exclusive all inactive
userSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});
//compare password to login
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bash.compare(candidatePassword, userPassword);
};
//determine the validity of JWT, JWTTimeStamp < changeTimeStamp =true,user have to login again
userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangeAt) {
    const changeTimeStamp = parseInt(this.passwordChangeAt.getTime() / 1000);
    return JWTTimeStamp < changeTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 1000 * 60 * 10; //10 mins
  return resetToken;
};
const User = moongoose.model("User", userSchema);
module.exports = User;