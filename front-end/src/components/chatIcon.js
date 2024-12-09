import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";

function ChatIcon(props) {
  // const [text, setText] = useState("");

  const totolText =
    props.message.length > 19
      ? `${props.message.slice(0, 19) + "..."}`
      : props.message;

  return (
    <div
      className="flex bg-slate-100 hover:bg-orange-100 rounded-lg p-1 mt-1 ml-1"
      style={{
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "relative",
        }}
      >
        <Avatar
          src={`${props.friendInfo.avatar}`}
          alt={`${props.friendInfo.avatar}`}
          sx={{
            fontSize: 10,
            filter: props.friendInfo.onlineStatus ? "none" : "grayscale(80%)",
          }}
        />

        <span
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            transform: "translateX(160%) translateY(-80%)",
            borderRadius: "50%",
            backgroundColor: `${
              props.friendInfo.onlineStatus ? "green" : "grey"
            }`,
            animation: "ripple 1.2s infinite ease-in-out",
          }}
        ></span>
      </span>
      <div className="flex flex-col w-full h-full">
        <div className="flex w-full flex-row justify-between items-center px-2 font-roboto text-gray-900 text-lg">
          <span
            className="flex flex-row justify-between w-full h-full"
            style={{
              flexGrow: 1,
              marginRight: "10px",
            }}
          >
            <p> {props.friendInfo.username}</p>
            <p className="text-right text-sm" style={{ flexShrink: 0 }}>
              {props.time}
            </p>
          </span>
        </div>

        <p
          className="px-2 text-left w-full font-roboto text-gray-900 text-sm"
          style={{
            position: "relative",
            height: "20px",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {totolText}
          {props.nonereadMes ? (
            <span
              style={{
                position: "absolute",
                top: "1px",
                right: "3px",
                backgroundColor: "blue",
                color: "white",
                borderRadius: "50%",
                width: "16px",
                height: "16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "10px",
                fontWeight: "bold",
              }}
            >
              {props.nonereadMes}
            </span>
          ) : (
            ""
          )}
        </p>
      </div>
    </div>
  );
}
export default ChatIcon;
