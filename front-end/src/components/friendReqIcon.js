import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaRegCircleXmark } from "react-icons/fa6";
import { useGlobalContext } from "../context/globalContext";
const serverUrl = process.env.REACT_APP_SERVER_URL;
function FriendReqIcon(props) {
  const [loading, setLoading] = useState(false);
  const { getAllFriendReq, getAllChatRecord } = useGlobalContext();
  const binaryData = new Uint8Array(props.avatar.data.data);
  const blob = new Blob([binaryData], {
    type: props.avatar.contentType,
  });
  const avatarUrl = URL.createObjectURL(blob);
  const handleAccept = async () => {
    try {
      setLoading(true);
      const result = await axios({
        url: `${serverUrl}/friends/request/accept`,
        method: "PATCH",
        withCredentials: true,
        data: {
          senderEmail: props.senderEmail,
          senderId: props._id,
          sendName: props.username,
        },
      });
      // console.log("result", result);
      if (result.data.status === "success") {
        await getAllFriendReq();
        await getAllChatRecord();
      }
      // console.log("result", result);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  const handleReject = async () => {
    try {
      setLoading(true);
      const result = await axios({
        url: `${serverUrl}/friends/request/reject`,
        method: "PATCH",
        withCredentials: true,
        data: {
          rejectEmail: props.senderEmail,
        },
      });
      await getAllFriendReq();
      // console.log("result", result);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={`flex bg-slate-100  rounded-lg p-1 ${
        loading ? "shrinkOut" : ""
      } `}
    >
      <span className="flex flex-row items-center">
        <Avatar
          src={avatarUrl}
          alt={avatarUrl}
          sx={{
            fontSize: 10,
            filter: props.onlineStatus ? "none" : "grayscale(80%)",
          }}
        />
      </span>
      <div className="flex items-center flex-row w-full">
        <div>
          <p className="text-left w-full px-2 font-roboto font-semibold text-gray-900 text-base">
            {props.username}
          </p>
          <p className="w-full px-2 text-xs">want to connect with you</p>
        </div>

        <div className="flex flex-row justify-between items-center px-2 w-16">
          <button
            onClick={handleAccept}
            className="hover:scale-125 transition-transform duration-100 ease-in-out"
          >
            <FaRegCircleCheck style={{ color: "green", fontSize: "20px" }} />
          </button>
          <button
            onClick={handleReject}
            className="hover:scale-125 transition-transform duration-100 ease-in-out"
          >
            <FaRegCircleXmark style={{ color: "grey", fontSize: "20px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
export default FriendReqIcon;

// {accepting ? (
//   <div>
//     <AiOutlineLoading3Quarters className="animate-spin" />
//   </div>
// ) : (
//   <button onClick={handleAccept}>
//     <FaRegCircleCheck style={{ color: "green", fontSize: "20px" }} />
//   </button>
// )}
// {rejecting ? (
//   <div>
//     <AiOutlineLoading3Quarters className="animate-spin" />
//   </div>
// ) : (
//   <button onClick={handleReject}>
//     <FaRegCircleXmark style={{ color: "grey", fontSize: "20px" }} />
//   </button>
// )}
