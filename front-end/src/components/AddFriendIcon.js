import Avatar from "@mui/material/Avatar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  IoIosAddCircleOutline,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import { BsSendCheck } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaBullseye } from "react-icons/fa";
const URL = process.env.REACT_APP_SERVER_URL;

function AddFriendIcon(props) {
  const [isClick, setClick] = useState(false);
  const [sendReq, setSendReq] = useState(false);
  const [loading, setLoading] = useState(FaBullseye);
  const email = props.email;
  const handleClick = () => {
    setClick(true);
    setSendReq(true);
    setTimeout(() => {
      setClick(false);
    }, 100);
  };
  useEffect(() => {
    async function sendFriendReq() {
      setLoading(true);
      try {
        const result = await axios({
          url: `${URL}/friends/request`,
          method: "POST",
          data: {
            receiverEmail: email,
          },
          withCredentials: true,
        });
        console.log("result", result);
      } catch (err) {
        console.log("err", err);
      } finally {
        setSendReq(false);
        setLoading(false);
      }
    }
    if (sendReq) sendFriendReq();
  }, [sendReq, email]);
  return (
    <div className="flex bg-slate-100  rounded-lg p-1">
      <span>
        <Avatar
          src={`${props.avatar}`}
          alt={`${props.avatar}`}
          sx={{
            fontSize: 10,
          }}
        />
      </span>
      <div className="flex items-center justify-between w-full">
        <p className="text-left px-2 font-roboto text-gray-900 text-sm">
          {props.name}
        </p>
        <div className="flex flex-row w-20 space-x-2">
          {!props.addSuccess ? (
            loading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              <button
                className={`transition-transform duration-100 ${
                  isClick ? "scale-90" : "scale-110"
                }`}
                onClick={handleClick}
              >
                <IoIosAddCircleOutline
                  className="hover:scale-125 transition-transform duration-200"
                  style={{
                    color: "#66bb6a",
                    fontSize: "30px",
                  }}
                />
              </button>
            )
          ) : (
            <IoMdCheckmarkCircleOutline
              className="transition-transform duration-200"
              style={{
                color: "#66bb6a",
                fontSize: "30px",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default AddFriendIcon;
