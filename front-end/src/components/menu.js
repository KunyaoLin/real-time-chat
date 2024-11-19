import React from "react";
import { FaRegBell } from "react-icons/fa";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsIcon from "@mui/icons-material/Settings";
import ChatPopUp from "./chatPopUp";
import ContactPopUp from "./contactPopUp";

function Menu() {
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
            }}
          >
            <ChatPopUp />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
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
      <div className=" bg-slate-900 min-h-screen flex flex-col">
        <div className="bg-white m-1 flex-grow rounded-md"></div>
      </div>
    </div>
  );
}
export default Menu;
