import React, { useEffect, useRef, useState } from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import "../styles.css";
import MessageInform from "./MessageInform";
import ChatIcon from "./chatIcon";
function ChatPopUp() {
  const [visiable, setVisiable] = useState(false);
  const [animateout, setAnimateout] = useState(false);

  const popUpRef = useRef(null);
  const name = "userImg2";
  const msg = "Hi, how is going today?";
  const handleAnimate = () => {
    setAnimateout(true);
    setTimeout(() => {
      setAnimateout(false);
      setVisiable(false);
    }, 300);
  };
  const handlePopUp = () => {
    if (visiable) {
      handleAnimate();
    } else {
      setVisiable(true);
    }
  };

  useEffect(() => {
    const handleGlobalPopUp = (e) => {
      if (popUpRef.current && !popUpRef.current.contains(e.target)) {
        handleAnimate();
      }
    };

    document.addEventListener("mousedown", handleGlobalPopUp);
    return () => {
      document.removeEventListener("mousedown", handleGlobalPopUp);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <button onClick={handlePopUp}>
        <IoChatbubbleEllipsesOutline
          style={{
            color: "white",
            fontSize: "30px",
            strokeWidth: "0.8",
          }}
        />
      </button>
      <MessageInform num={27} />

      {visiable && (
        <div
          className={`popUp ${animateout ? "hidden" : "active"} `}
          ref={popUpRef}
        >
          <div className="flex flex-col space-y-1">
            <ChatIcon name={name} msg={msg} />
            <ChatIcon name={name} msg={msg} />
          </div>
        </div>
      )}
    </div>
  );
}
export default ChatPopUp;
//写每个对话框的内容 包括头像，在线状态，聊天简短内容，姓名，不在线则灰度头像，在popup框中在线排序和消息最新排序，点击对话框后会直接跳转到大的对话界面并且弹回对话popup
