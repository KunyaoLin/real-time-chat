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
  socket.on("message", (msg) => {
    console.log("Message received:", msg);
    io.emit("message", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use("/", userRoute);
app.use("/chat", chatRoute);
app.get("/api/auth", authController.isLoggedIn);

// app.use("/api/chat", privateRoomRoute);

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
