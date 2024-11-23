import React from "react";
import Avatar from "@mui/material/Avatar";

function ChatIcon(props) {
  console.log("props.avatar:", props.avatar);
  return (
    <div className="flex bg-slate-100 hover:bg-orange-100 rounded-lg p-1 mt-1 ml-1">
      <span
        style={{
          position: "relative",
        }}
      >
        <Avatar
          src={`${props.avatar}`}
          alt={`${props.avatar}`}
          sx={{
            fontSize: 10,
          }}
        />

        <span
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            transform: "translateX(350%) translateY(-90%)",
            borderRadius: "50%",
            backgroundColor: `${props.online ? "green" : "grey"}`,
            animation: "ripple 1.2s infinite ease-in-out",
          }}
        ></span>
      </span>
      <div className="flex flex-col w-full ">
        <span className="text-left flex flex-row justify-between items-center px-2 font-roboto text-gray-900 text-lg">
          <p>{props.username}</p>
          {/* <p className="text-sm">{props.time}</p> */}
        </span>
        <p className="px-2 text-left font-roboto text-gray-900 text-sm">
          {/* {props.msg} */}
        </p>
      </div>
    </div>
  );
}
export default ChatIcon;
