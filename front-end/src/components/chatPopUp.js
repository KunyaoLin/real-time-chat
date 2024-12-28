import React from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import "../styles.css";
import MessageInform from "./MessageInform";
import ChatIcon from "./chatIcon";
import { useGlobalContext } from "../context/globalContext";
function ChatPopUp() {
  const { numUnreadMegs } = useGlobalContext();

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <IoChatbubbleEllipsesOutline
        style={{
          color: "white",
          fontSize: "30px",
          strokeWidth: "0.8",
        }}
      />

      <MessageInform num={numUnreadMegs} />
    </div>
  );
}
export default ChatPopUp;
