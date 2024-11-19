import React, { useEffect, useRef, useState } from "react";
import MessageInform from "./MessageInform";
import { MdAccountBox } from "react-icons/md";
import ContactIcon from "./contactIcon";

function ContactPopUp() {
  const [visiable, setVisiable] = useState(false);
  const [animateout, setAnimateout] = useState(false);
  const popUpRef = useRef(null);
  const name = "defaultUser";
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
      {" "}
      <button onClick={handlePopUp}>
        <MdAccountBox style={{ color: "white", fontSize: "30px" }} />
      </button>
      <MessageInform num={99} />
      {visiable && (
        <div
          className={`contactpopUp ${animateout ? "hidden" : "active"}`}
          ref={popUpRef}
        >
          <ContactIcon name={name} />
        </div>
      )}
    </div>
  );
}
export default ContactPopUp;
