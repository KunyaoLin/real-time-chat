import React from "react";
import Avatar from "@mui/material/Avatar";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaRegCircleXmark } from "react-icons/fa6";
function FriendReqIcon(props) {
  return (
    <div className="flex bg-slate-100  rounded-lg p-1">
      <span className="flex flex-row items-center">
        <Avatar
          src={`${props.avatar}`}
          alt={`${props.avatar}`}
          sx={{
            fontSize: 10,
            filter: props.online ? "none" : "grayscale(80%)",
          }}
        />
      </span>
      <div className="flex items-center flex-row w-full">
        <div>
          <p className="text-left w-full px-2 font-roboto font-semibold text-gray-900 text-base">
            {props.name}
          </p>
          <p className="w-full px-2 text-xs">want to connect with you</p>
        </div>

        <div className="flex flex-row justify-between items-center px-2 w-16">
          <button>
            <FaRegCircleCheck style={{ color: "green", fontSize: "20px" }} />
          </button>
          <button>
            <FaRegCircleXmark style={{ color: "grey", fontSize: "20px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
export default FriendReqIcon;
