//hello world
const authController = require("./controllers/authController");
// const privateRoomRoute = require("./routes/privateChatRouters");
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
// const { send } = require("process");
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
// app.use(cors({ origin: `${process.env.FRONT_END_URL}` }));
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
  socket.on("add_Onlineuser", (userId) => {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, []);
    } //这里的问题试试看 还有断开连接的时候
    onlineUsers.get(userId).push(socket.id);
  });
  console.log("onlineUsers", onlineUsers);
  socket.on("send_Message", async (message) => {
    try {
      const receiverSocketId = onlineUsers.get(message.receiverEmail);
      if (receiverSocketId) {
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
          console.log(newChat);
        }
        io.to(receiverSocketId).emit("receive-message", message);
        socket.emit("message-sent", {
          success: true,
        });
      }
    } catch (err) {
      console.log("message send failed");
      socket.emit("message-sent", { success: false });
    }
  });

  socket.on("user_disconnected", () => {
    //删除对应的socket.id 同时在退出的时候也要使用这个socket来发送userId

    for (const [userId, sockets] of onlineUsers.entries()) {
      const updateSockets = sockets.filter((id) => id !== socket.id);
      if (updateSockets.length > 0) {
        onlineUsers.set(userId, updateSockets);
        console.log("onlineUsersleft:", Array.from(onlineUsers.entries()));
      } else {
        onlineUsers.delete(userId);
        console.log(`${userId} logout`);
        console.log("onlineUsersleft:", Array.from(onlineUsers.entries()));
      }
    }

    console.log(`${socket.id} logout`);

    // const userId = onlineUsers.get(socket.id);
  });
  socket.on("disconnect", () => {
    for (const [userId, sockets] of onlineUsers.entries()) {
      const updateSockets = sockets.filter((id) => id !== socket.id);
      if (updateSockets.length > 0) {
        onlineUsers.set(userId, updateSockets);
        console.log("onlineUsersleft:", Array.from(onlineUsers.entries()));
      } else {
        onlineUsers.delete(userId);
        // console.log(`${userId} logout`);
        console.log("onlineUsersleft:", Array.from(onlineUsers.entries()));
      }
    }

    // console.log(`${socket.id} logout`);
  });
});

app.use("/", userRoute);
app.use("/chat", chatRoute);
app.get("/api/auth", authController.isLoggedIn);

// app.use("/api/chat", privateRoomRoute);

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
