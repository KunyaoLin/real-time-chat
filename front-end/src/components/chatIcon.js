import React from "react";
import Avatar from "@mui/material/Avatar";
function ChatIcon(props) {
  return (
    <div className="flex bg-slate-100 hover:bg-orange-100 rounded-lg p-1">
      <span>
        <Avatar
          src={`${props.name}.png`}
          alt={`${props.name}`}
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
            backgroundColor: "green",
          }}
        ></span>
      </span>
      <div className="flex flex-col w-full ">
        <p className="text-left px-2 font-roboto text-gray-900 text-sm">
          {props.name}
        </p>
        <p className="px-2 text-left font-roboto text-gray-900 text-lg">
          {props.msg}
        </p>
      </div>
    </div>
  );
}
export default ChatIcon;
