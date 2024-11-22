import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import ChatIcon from "./chatIcon";
import DialogueInChat from "./dialogueInChat";

function Main() {
  const [text, setText] = useState("");

  const name = "userImg2";
  const msg = "Hi, how is going today?";
  const time = "12:01";
  const online = true;
  const senderByFri = true;
  const senderByMe = true;
  const handleText = (e) => {
    setText(e.target.value);
  };

  return (
    <>
      <div
        className=" bg-slate-900 min-h-screen flex flex-col pr-8"
        style={{
          height: "100vh",
          width: "100vw",
        }}
      >
        <div
          className="bg-white m-2 p-2 flex flex-row rounded-lg"
          style={{
            height: "98vh",
            maxWidth: "calc(100% - 32px)",
          }}
        >
          <div
            className="flex flex-col w-72 overflow-y-scroll "
            style={{
              // maxHeight: "857px",
              height: "auto",
            }}
          >
            <ChatIcon name={name} msg={msg} online={online} time={time} />
            <ChatIcon name={name} msg={msg} />
          </div>
          <div
            className="flex flex-col w-full"
            style={{
              // width: "600px",
              //mac 100vw
              height: "97vh",
            }}
          >
            <span
              className="flex p-2 w-full font-bold text-3xl"
              style={{
                minHeight: "48px",
                fontFamily: "Roboto",
              }}
            >
              {name}
            </span>
            <div
              className="flex flex-col flex-grow"
              style={{
                overflow: "hidden",
                minHeight: "50vh",
                maxHeight: "70vh",
                overflowY: "auto",
                paddingBottom: "10px",
                height: "auto",
              }}
            >
              <DialogueInChat senderByFri={senderByFri} />
              <DialogueInChat senderByFri={senderByFri} />
              <DialogueInChat senderByFri={false} />
            </div>
            <div
              className="flex flex-col-2 w-full justify-center items-center space-x-1 m-2"
              style={{
                maxHeight: "32vh",
                minHeight: "5vh",
                height: "auto",
              }}
            >
              <div
                className="flex justify-end w-full items-center flex-grow"
                style={{
                  maxHeight: "32vh",
                  minHeight: "10vh",
                  // maxWidth: "100vw",
                  // width: "auto",
                  height: "auto",
                }}
              >
                <TextareaAutosize
                  value={text}
                  onChange={handleText}
                  minRows={1}
                  maxRows={5}
                  className="max-w-[60vw] w-full"
                  style={{
                    // maxWidth: "60vw",
                    // width: "auto",
                    maxHeight: "30vh",
                    overflowY: "auto",
                    backgroundColor: "#F1F5F9",
                    borderRadius: "8px",
                    resize: "none",
                    outline: "none",
                    textAlign: "left",
                    border: "1px solid #ccc",
                  }}
                  placeholder="Your message"
                ></TextareaAutosize>
              </div>
              <div
                className="flex justify-start w-full items-center flex-grow"
                style={{
                  maxWidth: "150px",
                  minHeight: "55px",
                  maxHeight: "150px",
                  height: "auto",
                }}
              >
                {" "}
                <Button variant="contained" endIcon={<SendIcon />}>
                  SEND
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Main;
