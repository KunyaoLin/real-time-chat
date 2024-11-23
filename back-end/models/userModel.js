const moongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const validator = require("validator");
//bcrypt => password, crypto=>token

const userSchema = new moongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "userName is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      validate: [validator.isEmail, "please provide a valid email"],
      unique: true,
      index: true,
    },
    avatar: {
      type: String,
      // default: "defaultUser",
      default:
        "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
    },
    role: {
      type: String,
      enum: ["regular", "VIP"],
      default: "regular",
    },
    onlineStatus: {
      type: Boolean,
      required: true,
      default: false,
    },
    password: {
      type: String,
      required: [true, "please provide your password"],
      minlength: 8,
      select: false,
    },
    passwordConfirmed: {
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
    passwordResetToken: String,

    passwordResetExpires: Date,

    active: {
      type: Boolean,
      select: false,
      default: true,
    },
  },
  { versionKey: false }
);
// this only work on user create or change password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirmed = undefined;
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
  return await bcrypt.compare(candidatePassword, userPassword);
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
