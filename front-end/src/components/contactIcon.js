import React from "react";
import Avatar from "@mui/material/Avatar";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiDeleteOutline } from "react-icons/ti";
import { SiAdblock } from "react-icons/si";
function ContactIcon(props) {
  return (
    <div className="flex bg-slate-100 hover:bg-orange-100 rounded-lg p-1">
      <span>
        <Avatar
          src={`${props.avatar}`}
          alt={`${props.avatar}`}
          sx={{
            fontSize: 10,
            filter: props.online ? "none" : "grayscale(80%)",
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
          }}
        ></span>
      </span>
      <div className="flex items-center justify-between w-full">
        <p className="text-left px-2 font-roboto text-gray-900 text-sm">
          {props.name}
        </p>
        <div className="flex flex-row w-20 space-x-2">
          <button>
            <IoChatboxEllipsesOutline />
          </button>
          <button>
            <SiAdblock />
          </button>
          <button>
            <TiDeleteOutline />
          </button>
        </div>
      </div>
    </div>
  );
}
export default ContactIcon;
