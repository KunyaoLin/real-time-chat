import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ChatIcon from "./chatIcon";
import DialogueInChat from "./dialogueInChat";
import { ObjectId } from "bson";
const URL = process.env.REACT_APP_SERVER_URL;

function Main({ socket }) {
  const [inputMessage, setInputMessage] = useState("");

  const [allUserRec, setAllUserRec] = useState([]);
  const [allMessageRec, setAllMessageRec] = useState({});
  const [openChat, setOpenChat] = useState(false);
  const [currentFriInfo, setCurrentFriInfo] = useState("");
  const [currentUserInfo, setCurrentUserInfo] = useState("");
  const handleInput = (e) => {
    setInputMessage(e.target.value);
  };
  const handleChatClick = (info, allMessageRec) => {
    console.log("info", info);
    if (currentFriInfo && currentFriInfo.email === info.email) {
      return;
    }
    setCurrentFriInfo(info);
    setAllMessageRec(allMessageRec);
    setOpenChat(true);
  };
  const handleSubmitMessage = (e) => {
    e.preventDefault();

    if (inputMessage.trim() !== "") {
      // const senderId = currentUserInfo[0];
      // const receicedId = currentFriInfo.email;
      const message = {
        message: inputMessage,
        senderEmail: `${currentUserInfo[0]}`,
        receiverEmail: `${currentFriInfo.email}`,
        _id: new ObjectId(),
        timeStamp: Date.now(),
        isRead: false,
      };
      setAllMessageRec((premessage) => [...premessage, message]);

      socket.emit("send_Message", message);
      // setshowMessage((premessage) => [...premessage, message]);

      setInputMessage("");
    }
  };

  useEffect(() => {
    let isCancel = false;
    async function getAllChatRecord() {
      try {
        const res = await axios({
          method: "GET",
          url: `${URL}/chat/getChatRecord`,
          withCredentials: true,
        });
        if (!isCancel && res && res.data) {
          setAllUserRec(res.data);
          setCurrentUserInfo(res.data.loginUserInfo);
        }
      } catch (err) {
        setAllUserRec([]);
      }
      // if (!isCancel) setTimeout(getAllChatRecord, 5000); //loop data for every 5s
    }

    getAllChatRecord();

    return () => {
      isCancel = true;
    };
  }, []);
  console.log("allMessageRec", allMessageRec);
  console.log("currentUserInfo", currentUserInfo);
  console.log("currentFriInfo", currentFriInfo);
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
            height: "700px",
            maxWidth: "calc(100% - 32px)",
            overflow: "hidden",
          }}
        >
          <div
            className="flex flex-col w-72 overflow-y-scroll "
            style={{
              // maxHeight: "857px",
              width: "200px",
              height: "500px",
              flexShrink: 0,
            }}
          >
            {allUserRec?.results?.length > 0 ? (
              allUserRec.results.map((el) => {
                const allMessageRec = el.messages;
                const message = allMessageRec[allMessageRec.length - 1];
                const lastNum = el.messages.length - 1;
                const hours = new Date(
                  el.messages[lastNum].timeStamp
                ).getHours();
                const mins = new Date(
                  el.messages[lastNum].timeStamp
                ).getMinutes();
                const time = `${hours < 10 ? "0" + hours : hours}:${
                  mins < 10 ? "0" + mins.toString() : mins
                }`;
                const friendInfo = el.participants.filter((t) => {
                  return t.email !== allUserRec.loginUserInfo[0];
                });
                // console.log("friendInfo:", friendInfo);
                return (
                  <button
                    onClick={() =>
                      handleChatClick(friendInfo[0], allMessageRec)
                    }
                    key={friendInfo[0].username}
                  >
                    <ChatIcon
                      friendInfo={friendInfo[0]}
                      key={friendInfo[0].username}
                      message={message.message}
                      time={time}
                      onClick={() => {
                        handleChatClick(friendInfo[0], allMessageRec);
                      }}
                      style={{
                        width: "270px",
                        height: "56px",
                      }}
                    />
                  </button>
                );
              })
            ) : (
              <div>no user found</div>
            )}
          </div>
          {openChat ? (
            <div
              className="flex flex-col w-full"
              style={{
                height: "680px",
              }}
            >
              <span
                className="flex p-2 w-full font-bold text-3xl"
                style={{
                  minHeight: "48px",
                  fontFamily: "Roboto",
                }}
                // key={currentFriInfo.username}
              >
                {currentFriInfo.username}
              </span>
              <div
                className="flex flex-col flex-grow"
                style={{
                  overflow: "hidden",
                  // minHeight: "60vh",
                  overflowY: "auto",
                  paddingBottom: "10px",
                  height: "1300px",
                }}
              >
                {allMessageRec.map((el) => {
                  const dialogues = el;
                  return (
                    <DialogueInChat
                      key={el._id}
                      dialogues={dialogues}
                      currentFriInfo={currentFriInfo}
                      currentUserInfo={currentUserInfo}
                    />
                  );
                })}
              </div>
              <div
                className="flex flex-col-2 justify-center items-center space-x-1 m-2"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  className="flex justify-end w-full items-center flex-grow"
                  style={{
                    maxHeight: "100%",
                    minHeight: "30%",
                    width: "auto",
                    height: "auto",
                  }}
                >
                  <TextareaAutosize
                    value={inputMessage}
                    onChange={handleInput}
                    minRows={1}
                    maxRows={5}
                    className="max-w-[60vw] w-full"
                    style={{
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
          ) : (
            <div>111</div>
          )}
        </div>
      </div>
    </>
  );
}
export default Main;
