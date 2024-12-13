import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaRegCircleXmark } from "react-icons/fa6";
import { useGlobalContext } from "../context/globalContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const URL = process.env.REACT_APP_SERVER_URL;
function FriendReqIcon(props) {
  const [accepting, setAccept] = useState(false);
  const [rejecting, setReject] = useState(false);

  const { getFriendReq } = useGlobalContext();

  const handleAccept = async () => {
    try {
      setAccept(true);
      const result = await axios({
        url: `${URL}/friends/request/accept`,
        method: "PATCH",
        withCredentials: true,
        data: {
          senderEmail: props.senderEmail,
        },
      });
      getFriendReq();
      console.log("result", result);
    } catch (err) {
    } finally {
      setAccept(false);
    }
  };
  const handleReject = async () => {
    try {
      setReject(true);
      const result = await axios({
        url: `${URL}/friends/request/reject`,
        method: "PATCH",
        withCredentials: true,
        data: {
          rejectEmail: props.senderEmail,
        },
      });
      getFriendReq();
      console.log("result", result);
    } catch (err) {
    } finally {
      setReject(false);
    }
  };
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
          {accepting ? (
            <div>
              <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
          ) : (
            <button onClick={handleAccept}>
              <FaRegCircleCheck style={{ color: "green", fontSize: "20px" }} />
            </button>
          )}
          {rejecting ? (
            <div>
              <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
          ) : (
            <button onClick={handleReject}>
              <FaRegCircleXmark style={{ color: "grey", fontSize: "20px" }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default FriendReqIcon;
