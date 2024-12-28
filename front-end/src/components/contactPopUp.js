import React, { useEffect, useRef, useState } from "react";
import { MdAccountBox } from "react-icons/md";
import ContactIcon from "./contactIcon";
import { useGlobalContext } from "../context/globalContext";

function ContactPopUp() {
  const [visiable, setVisiable] = useState(false);
  const [animateout, setAnimateout] = useState(false);
  // const [updateFriends, setUpdateFriends] = useState([]);

  const popUpRef = useRef(null);
  const { friends } = useGlobalContext();
  const handleAnimate = () => {
    setAnimateout(true);
    setTimeout(() => {
      setAnimateout(false);
      setVisiable(false);
    }, 300);
  };

  // console.log("updateFriends", updateFriends);
  const handlePopUp = () => {
    if (visiable) {
      handleAnimate();
    } else {
      setVisiable(true);
    }
  };
  // useEffect(() => {
  //   setUpdateFriends(friends);
  // }, [friends]);
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
          {friends.length > 0 ? (
            friends.map((el) => {
              const friendInfo = el.friends[0];
              const binaryData = new Uint8Array(friendInfo.avatar.data.data);
              const blob = new Blob([binaryData], {
                type: friendInfo.avatar.contentType,
              });
              const avatarUrl = URL.createObjectURL(blob);
              // console.log("avatarUrl", avatarUrl);
              return (
                <ContactIcon
                  handlePopUp={handlePopUp}
                  friendInfo={friendInfo}
                  status={el._doc.status}
                  avatarUrl={avatarUrl}
                  doc={el._doc}
                  key={friendInfo._id}
                />
              );
            })
          ) : (
            <div>Add your friend now !</div>
          )}
        </div>
      )}
    </div>
  );
}
export default ContactPopUp;
