//hello world
const authController = require("./controllers/authController");
const privateRoomRoute = require("./routes/privateChatRouters");
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
const { send } = require("process");
const ChatHistory = require("./models/chatHistoryModel");
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
    origin: `${process.env.FRONT_END_URL}`,
    methods: ["GET", "POST"],
  },
});
app.set("io", io);
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
// require("dotenv").config({ path: "./config.env" });
io.on("connection", (socket) => {
  console.log("one user connected ", socket.id);
  socket.on("add_Onlineuser", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  //检查发送对象是否在线，在线就在线发送消息
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
          { new: true }
        );
        console.log("result:", result);
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
        //假设我添加进去信息到数据库，那么我的消息另外一方是否会出现两次消息出现？考虑下
        io.to(receicedId).emit("receive-message", {
          senderId,
          message,
        });
        socket.emit("message-sent", {
          success: true,
        });
      }
    } catch (err) {
      console.log("message send failed");
      socket.emit("message-sent", { success: false });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const userId = onlineUsers.get(socket.id);
    if (userId) {
      onlineUsers.delete(userId);
      onlineUsers.delete(socket.id);
    }
  });
});

app.use("/", userRoute);
app.use("/chat", chatRoute);
app.get("/api/auth", authController.isLoggedIn);

// app.use("/api/chat", privateRoomRoute);

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
