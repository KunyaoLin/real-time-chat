import React from "react";
import Avatar from "@mui/material/Avatar";
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
      <div className="flex items-center w-full">
        <p className="text-left px-2 font-roboto text-gray-900 text-sm">
          {props.name}
        </p>
      </div>
    </div>
  );
}
export default ContactIcon;
