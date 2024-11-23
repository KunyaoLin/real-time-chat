import React, { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsIcon from "@mui/icons-material/Settings";
import ChatPopUp from "./chatPopUp";
import axios from "axios";

import ContactPopUp from "./contactPopUp";
import Main from "./main";
const URL = process.env.REACT_APP_SERVER_URL;

function Dashboard() {
  const [userInfo, setUserInfo] = useState([]);
  // useEffect(() => {
  //   const getOnline
  // }, []);
  useEffect(() => {
    // setUserInfo("");
    let isCancel = false;
    async function getAllChatRecord() {
      try {
        const res = await axios({
          method: "GET",
          url: `${URL}/chat/getChatRecord`,
          withCredentials: true,
        });
        if (res) {
          setUserInfo(res);
        }
      } catch (err) {
        setUserInfo([]);
        console.log("error", err);
      }
      // if (!isCancel) setTimeout(getAllChatRecord, 5000); //loop data for every 5s
    }

    getAllChatRecord();

    return () => {
      isCancel = true;
    };
  }, []);
  console.log("userInfo:", userInfo);

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
            {/* <MdAccountBox style={{ color: "white", fontSize: "30px" }} /> */}
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
          <ExitToAppIcon
            sx={{
              color: "white",
              fontSize: "30px",
            }}
          />

          <SettingsIcon sx={{ color: "white", fontSize: "30px" }} />
        </div>
      </div>
      <Main userInfo={userInfo} />
    </div>
  );
}
export default Dashboard;
