import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "@fontsource/roboto/400.css";
import { CircularProgress, Box } from "@mui/material";
import axios from "axios";
import Logout from "./logout";
const URL = process.env.REACT_APP_SERVER_URL;
let socket;
function BaseRoom() {
  const navigate = useNavigate();

  const [inputMessage, setInputMessage] = useState("");
  const [showMessage, setshowMessage] = useState([]);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const handleInput = (e) => {
    setInputMessage(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputMessage.trim() !== "") {
      const message = { text: inputMessage, senderId: socket.id };
      socket.emit("message", message);

      setshowMessage((premessage) => [...premessage, message]);

      setInputMessage("");
    }
  };
  const handleReset = () => {
    setshowMessage([]);
  };
  const messageListener = (msg) => {
    if (msg.senderId !== socket.id)
      setshowMessage((premessage) => [...premessage, msg]);
  };
  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await axios({
          method: "GET",
          url: `${URL}/api/auth`,
          withCredentials: true,
        });
        if (response.data.status === "success") {
          setAuthenticated(true);
          socket = io(`${URL}`, {
            transports: ["websocket"],
          });
          socket.on("connect", () => {
            console.log("connected to server with ID ", socket.id);
          });
          socket.on("message", messageListener);

          console.log(response);
        }
      } catch (err) {
        console.log("Not authenticated");
        setAuthenticated(false);
        navigate("/login");
      }
    }
    checkLogin();

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("message", messageListener);
        socket.disconnect();
      }
    };
  }, [navigate]);

  return isAuthenticated ? (
    <div>
      {" "}
      <div className="grid grid-cols-3 text-center w-full h-10  items-center">
        <div></div>
        <div className="w-full"> Welcome to my real-time chat room</div>
        <div className="flex justify-end">
          <Logout />
        </div>
      </div>
      <div className="border flex-col items-center flex h-80 p-2">
        <div className="p-2 m-2 h-20 w-44">
          <p>Public Message</p>
        </div>
        <div className="flex flex-col border w-full h-full items-center mt-2 overflow-y-auto">
          {showMessage?.map((message, index) => {
            return (
              <p key={index}>
                message-{index}:{message.text}
              </p>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col items-center h-60 p-4">
        <p>Input Text</p>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            value={inputMessage}
            onChange={handleInput}
            className="border w-60 h-auto mb-4 pt-2"
            type="text"
          ></input>
          <button
            type="submit"
            className="py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="py-1 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Clear
          </button>
        </form>
      </div>
    </div>
  ) : (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
}
export default BaseRoom;
