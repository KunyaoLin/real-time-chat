import React from "react";
import Avatar from "@mui/material/Avatar";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";
import { SiAdblock } from "react-icons/si";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";

function SearchFriendIcon(props) {
  return (
    <div className="flex bg-slate-100  rounded-lg p-1">
      <span>
        <Avatar
          src={`${props.avatar}`}
          alt={`${props.avatar}`}
          sx={{
            fontSize: 10,
            // filter: props.online ? "none" : "grayscale(80%)",
          }}
        />
        {/* <span
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            transform: "translateX(350%) translateY(-90%)",
            borderRadius: "50%",
            backgroundColor: `${props.online ? "green" : "grey"}`,
          }}
        ></span> */}
      </span>
      <div className="flex items-center justify-between w-full">
        <p className="text-left px-2 font-roboto text-gray-900 text-sm">
          {props.name}
        </p>
        <div className="flex flex-row w-20 space-x-2">
          {!props.addSuccess ? (
            <button>
              <IoIosAddCircleOutline
                className="hover:scale-125 transition-transform duration-200"
                style={{
                  color: "#66bb6a",
                  fontSize: "30px",
                }}
              />
            </button>
          ) : (
            <IoMdCheckmarkCircleOutline
              className="transition-transform duration-200"
              style={{
                color: "#66bb6a",
                fontSize: "30px",
              }}
            />
          )}

          {/* <button className="add-friend-icon">
            <span className="plus-icon">+</span>
          </button> */}

          {/* <button className="add-friend-button">
            <IoIosAddCircleOutline className="add-friend-icon" />
          </button> */}
        </div>
      </div>
    </div>
  );
}
export default SearchFriendIcon;
