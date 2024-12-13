import React from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import "../styles.css";
import MessageInform from "./MessageInform";
import ChatIcon from "./chatIcon";
import { useGlobalContext } from "../context/globalContext";
function ChatPopUp() {
  const { numUnreadMegs } = useGlobalContext();

  // const [visiable, setVisiable] = useState(false);
  // const [animateout, setAnimateout] = useState(false);

  // const popUpRef = useRef(null);
  // const name = "userImg2";
  // const msg = "Hi, how is going today?";
  // const handleAnimate = () => {
  //   setAnimateout(true);
  //   setTimeout(() => {
  //     setAnimateout(false);
  //     setVisiable(false);
  //   }, 300);
  // };
  // const handlePopUp = () => {
  //   if (visiable) {
  //     handleAnimate();
  //   } else {
  //     setVisiable(true);
  //   }
  // };

  // useEffect(() => {
  //   const handleGlobalPopUp = (e) => {
  //     if (popUpRef.current && !popUpRef.current.contains(e.target)) {
  //       handleAnimate();
  //     }
  //   };

  //   document.addEventListener("mousedown", handleGlobalPopUp);
  //   return () => {
  //     document.removeEventListener("mousedown", handleGlobalPopUp);
  //   };
  // }, []);

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
      {/* <button onClick={handlePopUp}>
        <IoChatbubbleEllipsesOutline
          style={{
            color: "white",
            fontSize: "30px",
            strokeWidth: "0.8",
          }}
        />
      </button> */}

      <MessageInform num={numUnreadMegs} />

      {/* {visiable && (
        <div
          className={`popUp ${animateout ? "hidden" : "active"} `}
          ref={popUpRef}
        >
          <div className="flex flex-col space-y-1">
            <ChatIcon name={name} msg={msg} />
            <ChatIcon name={name} msg={msg} />
          </div>
        </div>
      )} */}
    </div>
  );
}
export default ChatPopUp;
