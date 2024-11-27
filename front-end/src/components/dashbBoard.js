import React, { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsIcon from "@mui/icons-material/Settings";
import ChatPopUp from "./chatPopUp";
import { io } from "socket.io-client";

import ContactPopUp from "./contactPopUp";
import Main from "./main";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../ult/alert";
const URL = process.env.REACT_APP_SERVER_URL;

function Dashboard() {
  const [socket, setSocket] = useState("");
  const navigate = useNavigate();

  const hanldeExit = async () => {
    const response = await axios({
      method: "POST",
      url: `${URL}/logout`,
      withCredentials: true,
    });
    if (response.data.status === "logout successfully")
      showAlert("success", "logout successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };
  useEffect(() => {
    function ConnectIo() {
      try {
        socket = io(`${URL}`, {
          transports: ["websocket"],
        });
        setSocket(socket);
        socket.on("connect", () => {
          console.log("connected to server with ID ", socket.id);
        });
      } catch (err) {
        console.log(err);
      }
    }
    ConnectIo();
    return () => {
      if (socket) {
        socket.off("connect");
        socket.disconnect();
      }
    };
  }, []);
  return (
    <div
      className="grid grid-cols-[50px_auto] w-full h-full bg-slate-800"
      style={{
        position: "fixed",
      }}
    >
      <div className="flex flex-col h-screen">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: "9999",
            }}
          >
            <ChatPopUp />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              zIndex: "9999",
            }}
          >
            <ContactPopUp />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              <FaRegBell style={{ color: "white", fontSize: "30px" }} />
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                3
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            paddingTop: "30px",
            paddingBottom: "10px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <button onClick={hanldeExit}>
            <ExitToAppIcon
              sx={{
                color: "white",
                fontSize: "30px",
              }}
            />
          </button>

          <SettingsIcon sx={{ color: "white", fontSize: "30px" }} />
        </div>
      </div>
      <Main socket={socket} />
    </div>
  );
}
export default Dashboard;
