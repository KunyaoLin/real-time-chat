const authController = require("./controllers/authController");
const userRoute = require("./routes/userRouters");
const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const http = require("http");
const mongoose = require("mongoose");
const chatRoute = require("./routes/chatRouters");
const ChatHistory = require("./models/chatHistoryModel");
const Friends = require("./models/friendsModel");
const User = require("./models/userModel");
dotenv.config({ path: "./config.env" });
const DB_URL = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB_URL).then((el) => {
  console.log("database connected successfully");
});
app.enable("trust proxy");
app.use(cors({ origin: `${process.env.FRONT_END_URL}`, credentials: true }));
const server = http.createServer(app);
const port = process.env.PORT || 3001;
const onlineUsers = new Map();
const io = new Server(server, {
  cors: {
    origin: [
      `${process.env.FRONT_END_URL}/dashboard`,
      `${process.env.FRONT_END_URL}`,
    ],
    methods: ["GET", "POST"],
  },
});
app.set("io", io);
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
// require("dotenv").config({ path: "./config.env" });
io.on("connection", (socket) => {
  socket.on("addOnlineuser", async (userId) => {
    onlineUsers.set(userId, socket.id);
    await User.findOneAndUpdate(
      {
        email: userId,
      },
      {
        onlineStatus: true,
      }
    );
    const updateOnlineUsers = [...onlineUsers];
    console.log("onlineUsers add:", updateOnlineUsers);
  });
  socket.on("send_Message", async (message) => {
    // console.log("message:", message);
    try {
      const checkFriendExist = await Friends.find({
        friends: {
          $all: [message.senderEmail, message.receiverEmail],
        },
        status: "actived",
      });
      if (!checkFriendExist)
        throw new Error("You are blocked by this email,send message error");
      const senderInfo = await User.find({
        email: message.senderEmail,
      });
      const friendInfo = await User.find({
        email: message.receiverEmail,
      });
      const receiverSocketId = onlineUsers.get(message.receiverEmail);
      const result = await ChatHistory.findOneAndUpdate(
        {
          participants: {
            $all: [senderInfo[0]._id, friendInfo[0]._id],
          },
        },
        {
          $push: {
            messages: {
              senderEmail: message.senderEmail,
              receiverEmail: message.receiverEmail,
              message: message.message,
            },
          },
        },
        { new: true, upsert: true }
      );
      if (!result) {
        const newChat = await ChatHistory.create({
          participants: [senderInfo[0]._id, friendInfo[0]._id],
          messages: [
            {
              senderEmail: message.senderEmail,
              receiverEmail: message.receiverEmail,
              message: message.message,
            },
          ],
        });
        // console.log(newChat);
      }
      if (receiverSocketId) {
        await ChatHistory.findOneAndUpdate(
          {
            participants: {
              $all: [senderInfo[0]._id, friendInfo[0]._id],
            },
          },
          {
            isRead: true,
          }
        );
        socket.to(receiverSocketId).emit("receive-message", message);

        // socket.emit("message-sent", {
        //   success: true,
        // });
      }
    } catch (err) {
      console.log("message send failed");
      // socket.emit("message-sent", { success: false });
    }
  });

  socket.on("disconnect", async () => {
    let disconnectUserId = null;
    console.log("socketId:", socket.id);
    for (const [userId, socketId] of onlineUsers.entries()) {
      console.log("socketId:", socketId);
      if (socketId === socket.id) {
        disconnectUserId = userId;
        break;
      }
    }
    if (disconnectUserId) {
      // console.log("disconnectUserId:", disconnectUserId);
      const disconnectOne = await User.findOneAndUpdate(
        {
          email: disconnectUserId,
        },
        { onlineStatus: false }
      );
      // console.log("disconnectOne:", disconnectOne);
      onlineUsers.delete(disconnectUserId);
      const updateOnlineUsers = [...onlineUsers];

      console.log("OnlineUsers_left from 2:", updateOnlineUsers);
    }

    console.log(`${socket.id} logout`);
  });
});

app.use("/", userRoute);
app.use("/chat", chatRoute);
app.get("/api/auth", authController.isLoggedIn);

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
