import React from "react";
import Avatar from "@mui/material/Avatar";
function ContactIcon(props) {
  return (
    <div className="flex">
      <span>
        <Avatar
          src={`${props.name}.png`}
          alt={`${props.name}`}
          sx={{
            fontSize: 10,
          }}
        />
      </span>
      <div className="flex flex-col w-full">
        <p className="text-center">{props.name}</p>
        <p>message</p>
      </div>
    </div>
  );
}
export default ContactIcon;
