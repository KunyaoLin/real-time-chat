import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ChatIcon from "./chatIcon";
import DialogueInChat from "./dialogueInChat";
import { ObjectId } from "bson";
import { useGlobalContext } from "../context/globalContext";
const URL = process.env.REACT_APP_SERVER_URL;

function Main({ newSocket }) {
  const [inputMessage, setInputMessage] = useState("");
  // const [allMessageRec, setAllMessageRec] = useState([]);
  // const [openChat, setOpenChat] = useState(false);
  const bottomRef = useRef(null);
  const {
    editUnReadMegsNumByClick,
    editUnReadMegsBySend,
    Me,
    allUserRec,
    editAllUserRec,
    editCurrentFriInfo,
    currentFriInfo,
    handleChatWindow,
    openChat,
    allCurUserMessageRec,
    handleCurUserAllmegs,
    handleCurUserAllmegsByClick,
  } = useGlobalContext();
  console.log("allUserRec", allUserRec);

  const handleChatClick = async (info, allMessages) => {
    let unReadMegs = 0;

    if (currentFriInfo && currentFriInfo.email === info.email) {
      return;
    }
    console.log("info:", info);
    editCurrentFriInfo(info);
    // console.log("allMessages", allMessages);
    handleCurUserAllmegsByClick(allMessages); //array

    //dismiss unread megs
    allUserRec.forEach((el) => {
      const result = el.participants.filter((i) => {
        return i.email === info.email;
      });
      if (result.length !== 0) {
        el.messages.forEach((x) => {
          if (!x.isRead) {
            unReadMegs++;
            x.isRead = true;
          }
        });
        editUnReadMegsNumByClick(unReadMegs);
        console.log("unReadMegs:", unReadMegs);
      }
    });

    handleChatWindow(true);
    try {
      await axios({
        url: `${URL}/chat/setAllMesgRead`,
        method: "POST",
        data: {
          FriendInfo: info,
        },
        withCredentials: true,
      });
    } catch (err) {}
  };
  //submit message
  const handleSubmitMessage = (e) => {
    e.preventDefault();

    if (inputMessage.trim() !== "") {
      const message = {
        message: inputMessage,
        senderEmail: `${Me.email}`,
        receiverEmail: `${currentFriInfo.email}`,
        senderId: `${Me._id}`,
        receiverId: `${currentFriInfo._id}`,
        _id: new ObjectId(),
        timeStamp: Date.now(),
        isRead: false,
      };

      handleCurUserAllmegs(message);

      const newUserRec = allUserRec.map((el) => {
        const findone = el.participants.filter((el) => {
          return el.email === message.receiverEmail;
        });
        if (findone.length > 0) {
          return { ...el, messages: [...el.messages, message] };
        }

        return el;
      });

      editAllUserRec(newUserRec);
      newSocket.emit("send_Message", message);

      setInputMessage("");
    }
  };
  //roll down to the end megs
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [allCurUserMessageRec]);

  const handleInput = (e) => {
    setInputMessage(e.target.value);
    // console.log("inputMessage", inputMessage);
  };
  //handle receive message
  useEffect(() => {
    let isMount = true;
    if (!newSocket || !isMount) return;
    const handleMessage = (newMessage) => {
      const targetEmailArr = [
        newMessage.senderEmail,
        newMessage.receiverEmail,
      ].sort();
      //curren open windows is sender's
      if (currentFriInfo.email === newMessage.senderEmail) {
        const messageRead = {
          ...newMessage,
          isRead: true,
        };

        const receiveNewRec = allUserRec.map((el) => {
          const receiverArr = el.participants
            .map((el) => {
              return el.email;
            })
            .sort();

          const result = targetEmailArr.every(
            (value, index) => value === receiverArr[index]
          );
          console.log("result:", result);
          if (result) {
            return { ...el, messages: [...el.messages, messageRead] };
          }
          return el;
        });

        editAllUserRec(receiveNewRec);
        handleCurUserAllmegs(messageRead);
        const setAllRead = async () => {
          const setRead = await axios({
            url: `${URL}/chat/setAllMesgRead`,
            method: "POST",
            data: {
              FriendInfo: currentFriInfo,
            },
            withCredentials: true,
          });
          console.log("setRead:", setRead);
        };
        setAllRead();
      } else {
        const receiveNewRec = allUserRec.map((el) => {
          const receiverArr = el.participants
            .map((el) => {
              return el.email;
            })
            .sort();

          const result = targetEmailArr.every(
            (value, index) => value === receiverArr[index]
          );
          // console.log("result:", result);
          if (result) {
            editUnReadMegsBySend();

            return { ...el, messages: [...el.messages, newMessage] };
          }
          return el;
        });

        editAllUserRec(receiveNewRec);
      }
    };
    newSocket.on("receive-message", handleMessage);
    return () => {
      isMount = false;
      newSocket.off("receive-message", handleMessage);
    };
  }, [
    newSocket,
    allUserRec,
    currentFriInfo,
    editUnReadMegsBySend,
    editAllUserRec,
    handleCurUserAllmegs,
  ]);

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
              allUserRec
                .slice() //sort friend by onlineStatus
                .sort((a, b) => {
                  const resultOne = a.participants.filter((el) => {
                    const A =
                      el.email === Me.email ? 1 : el.onlineStatus ? 2 : -1;
                    return A > 1;
                  });
                  const resultTwo = b.participants.filter((el) => {
                    const B =
                      el.email === Me.email ? 1 : el.onlineStatus ? 2 : -1;
                    return B > 1;
                  });

                  return resultTwo.length === resultOne.length
                    ? 0
                    : resultTwo.length > 0
                    ? 1
                    : -1;
                })
                .map((el) => {
                  let nonereadMes = 0;
                  const allMessages = el.messages;
                  // console.log("allMessages", allMessages);
                  allMessages.forEach((e) => {
                    if (
                      currentFriInfo.email !== e.senderEmail &&
                      e.receiverEmail === Me.email &&
                      !e.isRead
                    )
                      nonereadMes++;
                  });

                  const lastMessage = allMessages[allMessages.length - 1];
                  const lastNum = el.messages.length - 1;
                  const hours = new Date(
                    el.messages[lastNum].timeStamp
                  ).getHours();
                  const mins = new Date(
                    el.messages[lastNum].timeStamp
                  ).getMinutes();
                  // console.log("mins", mins);
                  const time = `${hours < 10 ? "0" + hours : hours}:${
                    mins < 10 ? "0" + mins.toString() : mins
                  }`;
                  const friendInfo = el.participants.filter((t) => {
                    return t.email !== Me.email;
                  });
                  return (
                    <button
                      onClick={() => {
                        handleChatClick(friendInfo[0], allMessages);
                        // console.log("friendInfo[0]", friendInfo[0]);
                      }}
                      key={friendInfo[0].username}
                    >
                      <ChatIcon
                        nonereadMes={nonereadMes}
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
              <div>Start your first chat!</div>
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
                {allCurUserMessageRec.map((el) => {
                  const dialogues = el;
                  return (
                    <DialogueInChat
                      key={el._id}
                      dialogues={dialogues}
                      currentFriInfo={currentFriInfo}
                      Me={Me}
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
            <div className="flex w-full h-full flex-col items-center justify-center">
              <p className="text-center font-serif text-3xl">
                Welcome to Real Time Chat App
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default Main;
