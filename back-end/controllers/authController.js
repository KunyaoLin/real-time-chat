const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../ults/catchAsync");
const appError = require("../ults/appError");
const { promisify } = require("util");
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
    secure: req.secure || req.headers["x-forwarded-proto"] === "https", //when server run in http,req.secure return true
    sameSite: "None",
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
  console.log(email, password);
  if (!email && !password)
    return next(new appError("Please provide email and password", 400)); //insure got the user info from req

  //   res.status(200).json({
  //     status: "success",
  //     correct: correct,
  //     message: "welcome to real-chat room",
  //     data: { user },
  //   });
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError("Incorrect Email and password", 401));
  }
  createSendToken(user, 200, req, res);
}); //compare the candidatePassword with database'password

//logout
exports.logout = (req, res, next) => {
  //change cookie expire date to 10 sec
  req.cookie("jwt", "loggedOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httponly: true,
  });
  res.status(200).json({
    status: "logout successfully",
  });
};
// protect route&user
exports.protectTo = catchAsync(async (req, res, next) => {
  //get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startWith("bearer")
  )
    token = req.headers.authorization.split(" ")[1];
  else if (req.cookie.jwt) token = req.cookie.jwt;
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
  //this user_id is include in this room? build later
});

/////////////////////////////////////////
//check room permission VIP/ Regular room and restrict
exports.restrictTo = (req, res, next) => {
  //check the room role and user role
};
exports.isLoggedIn = (req, res, next) => {
  if (!req.cookie) {
  }
};
//forget password

//update password
//reset password
