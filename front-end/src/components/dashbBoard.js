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
let newSocket;
function Dashboard() {
  const [socket, setSocket] = useState("");
  const [userData, setUserData] = useState("");
  // const newSocketRef = useRef(null);

  const navigate = useNavigate();

  const hanldeExit = async () => {
    const response = await axios({
      method: "POST",
      url: `${URL}/logout`,
      withCredentials: true,
    });
    if (response.data.status === "logout successfully") {
      showAlert("success", "logout successfully");
      console.log("socket", socket);
      if (socket) {
        console.log("logout rn1");
        // socket.emit("user_disconnected");
        socket.disconnect();
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

        console.log("socket", socket);
        console.log("newSocket", newSocket);
        setSocket(newSocket);

        if (res.data.status === "success" && !socket) {
          if (!newSocket) {
            setUserData(userEmail);

            newSocket = io(`${URL}`, {
              transports: ["websocket"],
            });

            newSocket.on("connect", () => {
              console.log("connected to server with ID ", newSocket.id);
              newSocket.emit("add_Onlineuser", userEmail);
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
        newSocket.off("connect");
        newSocket.disconnect();
      }
    };
  }, [socket]);
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
      <Main
      // socket={socket}
      />
    </div>
  );
}
export default Dashboard;

// useEffect(() => {
//   let newSocket = null; // 明确声明局部变量
//   async function ConnectIo() {
//     try {
//       const res = await axios({
//         method: "GET",
//         url: `${URL}/api/auth`,
//         withCredentials: true,
//       });

//       const userEmail = res.data.userEmail;
//       console.log("socket", socket);
//       console.log("newSocket", newSocket);

//       // 如果已经有 socket 实例，直接返回
//       if (socket) {
//         console.log("Socket already connected:", socket);
//         return;
//       }

//       // 如果用户认证成功并且 newSocket 未初始化
//       if (res.data.status === "success" && userEmail) {
//         newSocket = io(`${URL}`, {
//           transports: ["websocket"],
//         });
//         setSocket(newSocket);

//         newSocket.on("connect", () => {
//           console.log("connected to server with ID ", newSocket.id);
//           newSocket.emit("add_Onlineuser", userEmail);
//           console.log("userEmail", userEmail);
//         });
//       }
//     } catch (err) {
//       console.error("Error connecting to socket:", err);
//     }
//   }

//   ConnectIo();

//   return () => {
//     if (socket) {
//       socket.off("connect");
//       socket.disconnect();
//     }
//   };
// }, []);
