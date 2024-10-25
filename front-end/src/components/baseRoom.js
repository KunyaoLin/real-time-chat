import React, { useState } from "react";
import "@fontsource/roboto/400.css";
// import { Typography } from "@mui/material";
function BaseRoom() {
  const [inputMessage, setInputMessage] = useState("");
  const [showMessage, setshowMessage] = useState([]);
  const handleInput = (e) => {
    setInputMessage(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== "") {
      setshowMessage((premessage) => [...premessage, inputMessage]);
      //   console.log(setshowMessage);

      setInputMessage("");
    }
  };

  return (
    <>
      <header className="flex justify-center">
        <p> Welcome to my real-time chat room</p>
      </header>
      <div className="border flex-col items-center flex h-80 p-2">
        <div className="p-2 m-2 h-20 w-44">
          <p>Public Message</p>
        </div>
        <div className="flex flex-col border w-full h-full items-center mt-2">
          {showMessage?.map((message, index) => {
            <p>
              Index:
              {index}
              {message}
            </p>;
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
        </form>
      </div>
    </>
  );
}
export default BaseRoom;
