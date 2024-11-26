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
        maxWidth: "100%", // 限制最大宽度
        overflow: "hidden", // 防止内容溢出
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
              marginRight: "10px", // 给时间间距
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
            height: "20px",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            // width: "200px",
            overflow: "hidden",
          }}
        >
          {totolText}
        </p>
      </div>
    </div>
  );
}
export default ChatIcon;
