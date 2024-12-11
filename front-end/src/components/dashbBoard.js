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
import { useGlobalContext } from "../context/globalContext";
import NotificationPopUp from "./notificationPopUp";
import AddFriends from "./addFriends";
const URL = process.env.REACT_APP_SERVER_URL;
let newSocket;

function Dashboard() {
  const [socket, setSocket] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [unReadMegs, setUnReadMegs] = useState("");
  // const newSocketRef = useRef(null);
  const navigate = useNavigate();

  // const countUnReadMegs = (num) => {
  //   setUnReadMegs(num);
  // };
  const handleExit = async () => {
    const response = await axios({
      method: "POST",
      url: `${URL}/logout`,
      withCredentials: true,
    });
    if (response.data.status === "logout successfully") {
      showAlert("success", "logout successfully");
      console.log("socket", socket);
      if (newSocket) {
        console.log("logout rn1");
        newSocket.disconnect();
        setSocket(null);
      }
      setTimeout(() => {
        console.log("logout rn2");
        navigate("/login");
      }, 1500);
    }
  };
  useEffect(() => {
    // let newSocket;
    // console.log("newSocket", newSocket);
    async function ConnectIo() {
      try {
        // if (socket) {
        //   console.log("Socket already connected:", socket);
        //   return;
        // }
        const res = await axios({
          method: "GET",
          url: `${URL}/api/auth`,
          withCredentials: true,
        });
        const userEmail = res.data.userEmail;
        setUserEmail(userEmail);

        // console.log("socket", socket);
        // console.log("newSocket", newSocket);

        if (res.data.status === "success" && !socket) {
          if (!newSocket) {
            newSocket = io(`${URL}`, {
              transports: ["websocket"],
            });
            setSocket(newSocket);

            newSocket.on("connect", () => {
              console.log("connected to server with ID ", newSocket.id);
              newSocket.emit("addOnlineuser", userEmail);
              console.log("userEmail", userEmail);

              // console.log("email:", res.data.user.userEmail);
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    ConnectIo();
    return () => {
      if (newSocket) {
        console.log("newSocket disconnect");
        newSocket.off("connect");
        newSocket.off("disconnect");
        newSocket.disconnect();
        setSocket(null);
        newSocket = null;
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
              zIndex: "9999",
            }}
          >
            <div>
              <AddFriends />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              zIndex: "9999",
            }}
          >
            <div>
              <NotificationPopUp />
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
          <button onClick={handleExit}>
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
      <Main newSocket={newSocket} />
    </div>
  );
}
export default Dashboard;
