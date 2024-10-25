//hello world
const dotenv = require("dotenv");
const express = require("express");
const socketIo = require("socket.io");
const cors = require("cors");
const app = express();
const http = require("http");
const Server = http.createServer(app);
const io = socketIo(Server);
dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
// require("dotenv").config({ path: "./config.env" });
io.on("connection", (socket) => {
  console.log("one user connected ", socket.id);
  socket.on("message", (data) => {
    console.log("Message received:", data);
    io.emit("message", data);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to private chat room");
});
Server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
