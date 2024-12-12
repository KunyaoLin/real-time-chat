import React, { useContext, useEffect, useRef, useState } from "react";
import MessageInform from "./MessageInform";
import { MdAccountBox } from "react-icons/md";
import ContactIcon from "./contactIcon";
import { useGlobalContext } from "../context/globalContext";

function ContactPopUp() {
  const [visiable, setVisiable] = useState(false);
  const [animateout, setAnimateout] = useState(false);
  const popUpRef = useRef(null);
  const { friends } = useGlobalContext();
  console.log("friends", friends);
  const handleAnimate = () => {
    setAnimateout(true);
    setTimeout(() => {
      setAnimateout(false);
      setVisiable(false);
    }, 300);
  };
  const handlePopUp = () => {
    console.log("visiable", visiable);
    console.log("animateout", animateout);
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
        <MdAccountBox style={{ color: "white", fontSize: "30px" }} />
      </button>
      {/* <MessageInform num={99} /> */}
      {visiable && (
        <div
          className={`contactpopUp ${
            animateout ? "hidden" : "active"
          } space-y-1`}
          ref={popUpRef}
        >
          {friends?.map((el) => {
            return (
              <ContactIcon
                name={el.friends[0].username}
                online={el.friends[0].onlineStatus}
                key={el.friends[0]._id}
                avatar={el.friends[0].avatar}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
export default ContactPopUp;
