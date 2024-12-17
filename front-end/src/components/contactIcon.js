import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import { TiDeleteOutline } from "react-icons/ti";
import { SiAdblock } from "react-icons/si";
import axios from "axios";
import { useGlobalContext } from "../context/globalContext";
import { GrUnlock } from "react-icons/gr";
const URL = process.env.REACT_APP_SERVER_URL;
function ContactIcon(props) {
  const [deleting, setDeleting] = useState(false);
  const [block, setBlock] = useState(false);
  const [isDeleteClick, setDeleteClick] = useState(false);
  const [isBlockClick, setBlockClick] = useState(false);

  const { getAllChatRecord, getAllFriends, getUnReadMegs, handleChatWindow } =
    useGlobalContext();

  const handleDeletClick = () => {
    setDeleteClick(true);
    setTimeout(() => {
      setDeleteClick(false);
      setTimeout(() => {
        handleDelete();
      }, 100);
    }, 100);
  };
  const handleBlockClick = () => {
    setBlockClick(true);
    setTimeout(() => {
      setBlockClick(false);
      setTimeout(() => {
        handleBlock();
      }, 100);
    }, 100);
  };
  const handleBlock = async () => {
    const isBlock = window.confirm(
      "Are you sure you want to Block this friend?"
    );
    if (isBlock) {
      try {
        const result = await axios({
          url: `${URL}/friends/blockFriend`,
          method: "PATCH",
          withCredentials: true,
          data: {
            blockEmail: props.friendInfo.email,
          },
        });
        if (result.data.status === "success") {
          setBlock(true);
        }
        console.log("result", result);
      } catch (err) {
      } finally {
      }
    }
  };
  const handleDelete = async () => {
    const isDelete = window.confirm(
      "Are you sure you want to delete this friend?"
    );
    if (isDelete) {
      setDeleting(true);

      try {
        const result = await axios({
          url: `${URL}/friends/request/delete`,
          method: "PATCH",
          withCredentials: true,
          data: {
            deleteEmail: props.friendInfo.email,
          },
        });
        if (result.data.status === "success") {
          handleChatWindow(false);
          await getAllFriends();
          await getUnReadMegs();
          await getAllChatRecord(true);
        }
      } catch (err) {
      } finally {
        setDeleting(false);
      }
    }

    // if(result.data.data.status)
  };
  // console.log("friendInfo", props.friendInfo);
  return (
    <div
      className={`flex bg-slate-100 hover:bg-orange-100 rounded-lg p-1 ${
        deleting ? "delete-animation" : ""
      }`}
    >
      <span>
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
            transform: "translateX(350%) translateY(-90%)",
            borderRadius: "50%",
            backgroundColor: `${
              props.friendInfo.onlineStatus ? "green" : "grey"
            }`,
          }}
        ></span>
      </span>
      <div className="flex items-center justify-between w-full">
        <p className="text-left px-2 font-roboto text-gray-900 text-sm">
          {props.friendInfo.username}
        </p>
        <div className="flex items-center justify-center flex-row w-28 space-x-2">
          <button
            className={`transition-transform duration-100 ${
              isBlockClick ? "scale-75" : "scale-100"
            }`}
            onClick={handleBlockClick}
          >
            {props.status === "blocked" ? (
              <GrUnlock></GrUnlock>
            ) : (
              <SiAdblock
                className="hover:scale-125 transition-transform"
                style={{
                  fontSize: "18px",
                  color: "red",
                }}
              />
            )}
          </button>
          <button
            className={`transition-transform duration-100 ${
              isDeleteClick ? "scale-75" : "scale-100"
            }`}
            onClick={handleDeletClick}
          >
            <TiDeleteOutline
              className="hover:scale-125 transition-transform duration-200"
              style={{
                fontSize: "24px",
                // transition: "transform 0.2s ease-in-out",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
export default ContactIcon;
