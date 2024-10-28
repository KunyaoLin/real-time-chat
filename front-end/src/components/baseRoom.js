import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "@fontsource/roboto/400.css";
// const socket = io(`http://localhost:${process.env.PORT}`);
const socket = io("http://localhost:3001", { transports: ["websocket"] });

function BaseRoom() {
  const [inputMessage, setInputMessage] = useState("");
  const [showMessage, setshowMessage] = useState([]);
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
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with ID", socket.id);
    });
    const messageListener = (msg) => {
      if (msg.senderId !== socket.id)
        setshowMessage((premessage) => [...premessage, msg]);
    };
    socket.on("message", messageListener);
    return () => {
      socket.off("message", messageListener);
    };
  }, []);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const response = await fetch(`http://localhost:${process.env.PORT}`);
  //       const data = await response.json();
  //       setshowMessage((premessage) => [...premessage, data.message]);
  //     } catch (err) {}
  //   }
  //   fetchData();
  // }, []);

  return (
    <>
      <header className="flex justify-center">
        <p> Welcome to my real-time chat room</p>
      </header>
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
    </>
  );
}
export default BaseRoom;
