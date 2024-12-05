import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ChatIcon from "./chatIcon";
import DialogueInChat from "./dialogueInChat";
import { ObjectId } from "bson";
const URL = process.env.REACT_APP_SERVER_URL;

function Main({ newSocket }) {
  const [inputMessage, setInputMessage] = useState("");

  const [allUserRec, setAllUserRec] = useState([]);
  const [allMessageRec, setAllMessageRec] = useState([]);
  const [openChat, setOpenChat] = useState(false);
  const [currentFriInfo, setCurrentFriInfo] = useState("");
  const [currentUserInfo, setCurrentUserInfo] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [allMessageRec]);
  const handleInput = (e) => {
    setInputMessage(e.target.value);
  };
  const handleChatClick = (info, allMessages) => {
    if (currentFriInfo && currentFriInfo.email === info.email) {
      return;
    }
    setCurrentFriInfo(info);
    setAllMessageRec(allMessages);
    setOpenChat(true);
  };
  //submit message
  const handleSubmitMessage = (e) => {
    e.preventDefault();

    if (inputMessage.trim() !== "") {
      const message = {
        message: inputMessage,
        senderEmail: `${currentUserInfo[0]}`,
        receiverEmail: `${currentFriInfo.email}`,
        _id: new ObjectId(),
        timeStamp: Date.now(),
        isRead: false,
      };
      console.log(message);
      setAllMessageRec((premessage) => [...premessage, message]);
      const newUserRec = allUserRec.map((el) => {
        const findone = el.participants.filter((el) => {
          return el.email === message.receiverEmail;
        });
        console.log("findone:", findone);
        if (findone.length > 0) {
          return { ...el, messages: [...el.messages, message] };
        }

        return el;
      });
      // console.log("newUserRec:", newUserRec);
      setAllUserRec(newUserRec);
      newSocket.emit("send_Message", message);

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
          setAllUserRec(res.data.results);
          // console.log("res:", res);
          setCurrentUserInfo(res.data.loginUserInfo);
        }
      } catch (err) {
        setAllUserRec([]);
      }
      if (!isCancel) setTimeout(getAllChatRecord, 3000); //loop data for every 3s
    }

    getAllChatRecord();

    return () => {
      isCancel = true;
    };
  }, []);
  useEffect(() => {
    let isMount = true;
    if (!newSocket || !isMount) return;
    const handleMessage = (newMessage) => {
      const targetEmailArr = [
        newMessage.senderEmail,
        newMessage.receiverEmail,
      ].sort();
      // console.log("targetEmailArr", targetEmailArr);
      const receiveNewRec = allUserRec.map((el) => {
        const receiverArr = el.participants
          .map((el) => {
            return el.email;
          })
          .sort();
        const result = targetEmailArr.every(
          (value, index) => value === receiverArr[index]
        );

        if (result) {
          return { ...el, messages: [...el.messages, newMessage] };
        }
        return el;
      });

      setAllUserRec(receiveNewRec);
      console.log("currentFriInfo", currentFriInfo);
      console.log("newMessageRec", newMessage.senderEmail);
      console.log("test", currentFriInfo.email === newMessage.senderEmail);
      if (currentFriInfo.email === newMessage.senderEmail) {
        setAllMessageRec((premessage) => [...premessage, newMessage]);
      }
    };
    newSocket.on("receive-message", handleMessage);

    return () => {
      isMount = false;
      newSocket.off("receive-message", handleMessage);
    };
  }, [newSocket, allUserRec, currentFriInfo]);
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
            height: "1400px",
            maxWidth: "calc(100% - 32px)",
          }}
        >
          <div
            className="flex flex-col w-72 overflow-y-scroll "
            style={{
              width: "200px",
              height: "500px",
              flexShrink: 0,
            }}
          >
            {allUserRec?.length > 0 ? (
              allUserRec.map((el) => {
                const allMessages = el.messages;
                const lastMessage = allMessages[allMessages.length - 1];
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
                  return t.email !== currentUserInfo[0];
                });
                // console.log("friendInfo:", friendInfo);
                return (
                  <button
                    onClick={() => handleChatClick(friendInfo[0], allMessages)}
                    key={friendInfo[0].username}
                  >
                    <ChatIcon
                      friendInfo={friendInfo[0]}
                      key={friendInfo[0].username}
                      message={lastMessage.message}
                      time={time}
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
                height: "450px",
                // height: "100%",

                overflow: "hidden",
              }}
            >
              <span
                className="flex p-2 w-full font-bold text-3xl"
                style={{
                  minHeight: "48px",
                  fontFamily: "Roboto",
                }}
              >
                {currentFriInfo.username}
              </span>
              <div
                className="flex flex-col flex-grow"
                style={{
                  overflow: "hidden",
                  overflowY: "auto",
                  paddingBottom: "10px",
                  height: "750px",
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
                <div ref={bottomRef} />
              </div>

              <form
                className="flex flex-col-2 justify-center items-start space-x-1 m-2"
                style={{
                  width: "100%",
                  height: "100%",
                }}
                onSubmit={handleSubmitMessage}
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
                    type="submit"
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
                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon />}
                  >
                    SEND
                  </Button>
                </div>
              </form>
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
