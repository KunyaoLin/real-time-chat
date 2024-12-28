const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../ults/catchAsync");
const appError = require("../ults/appError");
const { promisify } = require("util");
const Email = require("../ults/email");
const crypto = require("crypto");
//signToken and createSendToken

const signToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRECT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,

    secure:
      req.secure ||
      (process.env.NODE_ENV === "production" &&
        req.headers["x-forwarded-proto" === "https"]), //when server run in http,req.secure return true
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
//signup
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmed: req.body.passwordConfirmed,
  });
  //   res.status(200).json({
  //     status: "success",
  //     data: { newUser },
  //   });

  createSendToken(newUser, 200, req, res);
  // add send email to recipient function
});
//login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password)
    return next(new appError("Please provide email and password", 400)); //insure got the user info from req

  const user = await User.findOneAndUpdate(
    { email },
    {
      onlineStatus: true,
    }
  ).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError("Incorrect Email and password", 401));
  }
  createSendToken(user, 200, req, res);
}); //compare the candidatePassword with database'password

//logout
exports.logout = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    {
      email: req.user.email,
    },
    {
      onlineStatus: false,
    }
  );
  if (!user)
    return res.status(500).json({
      message: "logout error",
    });
  //change cookie expire date to 10 sec
  res.cookie("jwt", "loggedOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httponly: true,
  });
  res.status(200).json({
    status: "logout successfully",
  });
});
// protect route&user
exports.protectTo = catchAsync(async (req, res, next) => {
  //get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];
  else if (req.cookies.jwt) token = req.cookies.jwt;
  if (!token)
    return next(new appError("You are not login, please login your account"));

  //verify token
  const decode = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRECT_KEY
  );
  //find this user by id
  const currentUser = await User.findById(decode.userId);
  if (!currentUser)
    return next(
      new appError("the user belongs to this token is no longer exist", 401)
    );
  //return user to req and res

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
  //this user_id is include in this room? build later
});

/////////////////////////////////////////
//check room permission VIP/ Regular room and restrict
exports.restrictTo = (req, res, next) => {
  //check the room role and user role
};
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Not authenicated, Please login in your account",
    });
  }
  jwt.verify(token, process.env.JWT_SECRECT_KEY, async (err, decode) => {
    if (err)
      return res.status(403).json({
        status: "error",
        message: "Invalid token",
      });
    try {
      const { userId } = decode;
      const currentUser = await User.findById(userId);
      if (!currentUser)
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      return res.status(200).json({
        status: "success",
        message: "Authenticated",
        userEmail: currentUser.email,
        currentUser,
        user: decode,
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  });
});
//forget password

exports.forgetPassword = catchAsync(async (req, res, next) => {
  //input your email info
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(404).json({
      status: "error",
      message: "User not register",
    });
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    // console.log("resToken:", resetToken);
    //create new email template
    // const resURL = `${req.protocol}://${req.get(
    //   "host"
    // )}/resetPassword/${resetToken}`;
    const resURL = `${process.env.FRONT_END_URL}/resetPassword/${resetToken}`;
    // console.log("resURL:", resURL);

    await new Email(user, resURL).sendPasswordForget();
    res.status(200).json({
      status: "success",
      resetToken,
      message: "Token sent to your email",
    });
  } catch (err) {}

  //when the user click the link, navigate them to reset password page
  //back to login
});
//reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user)
    return res.status(400).json({
      status: "error",
      message: "Token is invalid or has expired",
    });
  user.password = req.body.password;
  user.passwordConfirmed = req.body.passwordConfirmed;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, req, res);
  //auth the token
});
//update password
exports.updatePassword = catchAsync(async (req, res) => {
  //get current password
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const user = await User.findOne({
    email: req.user.email,
    onlineStatus: true,
  }).select("+password");
  if (
    !user ||
    !currentPassword ||
    !(await user.correctPassword(currentPassword, user.password))
  ) {
    return res.status(200).json({
      status: "error",
      message: "wrong current password",
    });
  }
  user.password = newPassword;
  user.passwordConfirmed = newPassword;
  await user.save();
  // const token = signToken(user._id);

  // res.cookie("jwt", "", {
  //   expires: new Date(0),
  //   httpOnly: true,

  //   secure:
  //     req.secure ||
  //     (process.env.NODE_ENV === "production" &&
  //       req.headers["x-forwarded-proto" === "https"]), //when server run in http,req.secure return true
  //   sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  // });
  res.clearCookie("jwt", {
    httpOnly: true,
    secure:
      req.secure ||
      (process.env.NODE_ENV === "production" &&
        req.headers["x-forwarded-proto"] === "https"),
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res.status(200).json({
    status: "success",
  });
});
