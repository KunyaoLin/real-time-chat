import React, { useEffect, useRef, useState } from "react";
import { MdAccountBox } from "react-icons/md";
import ContactIcon from "./contactIcon";
import { useGlobalContext } from "../context/globalContext";

function ContactPopUp() {
  const [visiable, setVisiable] = useState(false);
  const [animateout, setAnimateout] = useState(false);

  const popUpRef = useRef(null);
  const { friends } = useGlobalContext();
  const handleAnimate = () => {
    setAnimateout(true);
    setTimeout(() => {
      setAnimateout(false);
      setVisiable(false);
    }, 300);
  };

  console.log("friends", friends);
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
      {/* <MessageInform num={99} /> */}
      {visiable && (
        <div
          className={`contactpopUp ${
            animateout ? "hidden" : "active"
          } space-y-1`}
          ref={popUpRef}
        >
          {friends?.map((el) => {
            const friendInfo = el.friends[0];
            console.log("el", el.friends);
            return (
              <ContactIcon
                handlePopUp={handlePopUp}
                friendInfo={friendInfo}
                status={el._doc.status}
                key={friendInfo._id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
export default ContactPopUp;
