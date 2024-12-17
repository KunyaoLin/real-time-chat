import React, { useContext, useEffect, useRef, useState } from "react";
import MessageInform from "./MessageInform";
import { MdAccountBox } from "react-icons/md";
import { FaRegBell } from "react-icons/fa";

import { useGlobalContext } from "../context/globalContext";
import FriendReqIcon from "./friendReqIcon";

function NotificationPopUp() {
  const [visiable, setVisiable] = useState(false);
  const [animateout, setAnimateout] = useState(false);
  const popUpRef = useRef(null);
  const { allFriendsReq } = useGlobalContext();
  console.log("allFriendsReqallFriendsReq", allFriendsReq);
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
      <MessageInform num={allFriendsReq?.length}></MessageInform>
      <button onClick={handlePopUp}>
        <FaRegBell style={{ color: "white", fontSize: "30px" }} />
      </button>
      {visiable && (
        <div
          className={`bellpopUp ${animateout ? "hidden" : "active"} space-y-1`}
          ref={popUpRef}
        >
          {allFriendsReq.length > 0 ? (
            allFriendsReq.map((el) => {
              return (
                <FriendReqIcon
                  senderEmail={el.senderEmail}
                  username={el.senderId.username}
                  onlineStatus={el.senderId.onlineStatus}
                  key={el.senderId.username}
                  avatar={el.senderId.avatar}
                  _id={el.senderId._id}
                />
              );
            })
          ) : (
            <div>No notification receive</div>
          )}
        </div>
      )}
    </div>
  );
}
export default NotificationPopUp;
