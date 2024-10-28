//hello world
const privateRoomRoute = require("./routes/privateRoomRouters");
const publicRoomRoute = require("./routes/publicRoomRouters");
const dotenv = require("dotenv");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const http = require("http");
dotenv.config({ path: "./config.env" });
app.use(cors({ origin: "http://localhost:3000" }));
const server = http.createServer(app);

const port = process.env.PORT || 3001; //`http://localhost:${port}`,
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
app.set("io", io);
app.use(express.json());
app.use(express.static("public"));

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

app.use("/", publicRoomRoute);
app.use("/api/chat", privateRoomRoute);

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
