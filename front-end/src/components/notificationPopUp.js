import React, { useContext, useEffect, useRef, useState } from "react";
import MessageInform from "./MessageInform";
import { MdAccountBox } from "react-icons/md";
import { FaRegBell } from "react-icons/fa";

import ContactIcon from "./contactIcon";
import { useGlobalContext } from "../context/globalContext";
import FriendReqIcon from "./friendReqIcon";

function NotificationPopUp() {
  const [visiable, setVisiable] = useState(false);
  const [animateout, setAnimateout] = useState(false);
  const popUpRef = useRef(null);
  const { allFriendsReq } = useGlobalContext();

  const handleAnimate = () => {
    setAnimateout(true);
    setTimeout(() => {
      setAnimateout(false);
      setVisiable(false);
    }, 300);
  };
  const handlePopUp = () => {
    // console.log("visiable", visiable);
    // console.log("animateout", animateout);
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
      {" "}
      <button onClick={handlePopUp}>
        <FaRegBell style={{ color: "white", fontSize: "30px" }} />
      </button>
      {visiable && (
        <div
          className={`bellpopUp ${animateout ? "hidden" : "active"} space-y-1`}
          ref={popUpRef}
        >
          {allFriendsReq?.map((el) => {
            return (
              <FriendReqIcon
                name={el.senderId.username}
                online={el.senderId.onlineStatus}
                key={el.senderId.username}
                avatar={el.senderId.avatar}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
export default NotificationPopUp;
