import React, { useEffect, useRef, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
// import { useGlobalContext } from "../context/globalContext";
import { PiSpinnerGapBold } from "react-icons/pi";
import { VscChromeClose } from "react-icons/vsc";
import { VscCheck } from "react-icons/vsc";

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import Logo from "./logo";
import axios from "axios";
import { showAlert } from "../ult/alert";
import { useNavigate } from "react-router-dom";
const serverUrl = process.env.REACT_APP_SERVER_URL;

function Setting() {
  const navigate = useNavigate();
  const [visiable, setVisiable] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [usernameOpen, setNameOpen] = useState(true);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [file, setFile] = useState("");

  const [username, setUsername] = useState("");
  const [confirmUsername, setConfirmName] = useState("");
  const [usernameStatus, setUsernameStatus] = useState(false);
  const [currentPassword, setcurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState(false);

  const settingPopRef = useRef(null);
  const handleAnimate = () => {
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
      setVisiable(false);
    }, 300);
  };
  const handlePopUp = () => {
    if (visiable) {
      handleAnimate();
    } else {
      setVisiable(true);
    }
  };
  const handleUsername = (e) => {
    // setUsername(e.target.value);
    setNameOpen(true);
    setPasswordOpen(false);
    setAvatarOpen(false);
  };
  const editUsername = (e) => {
    setUsername(e.target.value);
    setUsernameStatus(false);
  };
  const editconfirmUsername = (e) => {
    setConfirmName(e.target.value);
    setUsernameStatus(false);
  };
  const submitUsernameChange = async (e) => {
    e.preventDefault();
    if (username !== confirmUsername) {
      setUsername("");
      setConfirmName("");
      showAlert("error", "please input same username");
      return;
    }
    try {
      setLoading(true);
      setUsernameStatus(true);

      const response = await axios({
        url: `${serverUrl}/setting/usernameUpdate`,
        method: "PATCH",
        withCredentials: true,
        data: { username },
      });
      if (response.data.status === "success") {
        setUsername("");
        setConfirmName("");
      }
      // console.log("response", response);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  const handlePassword = (e) => {
    // setPassword(e.target.value);
    setPasswordOpen(true);
    setNameOpen(false);
    setAvatarOpen(false);
  };
  const editCurrentPassword = (e) => {
    setcurrentPassword(e.target.value);
  };
  const editNewPassword = (e) => {
    setNewPassword(e.target.value);
  };
  const submitPasswordChange = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios({
        url: `${serverUrl}/setting/updatePassword`,
        method: "PATCH",
        withCredentials: true,
        data: { currentPassword, newPassword },
      });
      if (response.data.status === "error") {
        showAlert("error", response.data.message);
      }
      if (response.data.status === "success") {
        showAlert("success", "update password success and please login again");
        setInterval(() => {
          window.location.href = "/login";
        }, 3000);
      }
      // console.log("response", response);
    } catch (err) {
      // console.error("Error:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleAvatar = () => {
    setAvatarOpen(true);
    setNameOpen(false);
    setPasswordOpen(false);
  };
  const handleFileChange = (e) => {
    // console.log("e.target.file[0]", e.target.files[0]);
    setFile(e.target.files[0]);
    setUploadSuccess(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateImage = ["image/jpeg", "image/png"];
    if (!file) {
      showAlert("error", "Please select a file first!");
      return;
    }
    if (!validateImage.includes(file.type)) {
      showAlert("Please upload jpeg/png image");
      return;
    }
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      setLoading(true);
      const response = await axios({
        url: `${serverUrl}/setting/uploadAvatar`,
        method: "POST",
        withCredentials: true,
        data: formData,
      });
      // console.log("response", response);
      if (response.data.status === "success") {
        setUploadSuccess(true);
      }
      // console.log("upload-success", response.data);
    } catch (err) {
      // console.log("uploadError", err);
      setUploadSuccess(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const handleSettingPopup = (e) => {
      if (settingPopRef.current && !settingPopRef.current.contains(e.target)) {
        handleAnimate();
      }
    };
    document.addEventListener("mousedown", handleSettingPopup);
    return () => {
      document.removeEventListener("mousedown", handleSettingPopup);
    };
  }, []);
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <button
        onClick={() => {
          handlePopUp(true);
        }}
      >
        <SettingsIcon sx={{ color: "white", fontSize: "30px" }} />
      </button>
      {visiable && (
        <div
          className={`settingPopup ${animate ? "hidden" : "active"}`}
          ref={settingPopRef}
        >
          <div className="grid grid-cols-3 items-center justify-items-center ">
            <div>
              <button onClick={handleUsername} className="font-bold">
                Change Username
              </button>
            </div>
            <div>
              <button onClick={handlePassword} className="font-bold">
                Change Password
              </button>
            </div>
            <div>
              <button onClick={handleAvatar} className="font-bold">
                Edit avatar
              </button>
            </div>
          </div>
          {usernameOpen ? (
            <Box
              sx={{
                // paddingX: 20,
                justifyContent: "center",
                margin: "0 auto",
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              <form onSubmit={submitUsernameChange}>
                <Card
                  sx={{
                    maxWidth: 450,
                    margin: "auto",
                    mt: 8,
                    padding: 2,
                  }}
                >
                  <Logo />

                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        textAlign: "left",
                        fontFamily: "'Roboto','sans-serif'",
                        fontSize: "36px",
                      }}
                      gutterBottom
                    >
                      Change Username
                    </Typography>
                    <TextField
                      label="New Username"
                      margin="normal"
                      variant="outlined"
                      type="name"
                      value={username}
                      onChange={editUsername}
                      fullWidth
                    ></TextField>
                    <TextField
                      label="Confirm Username"
                      margin="normal"
                      variant="outlined"
                      value={confirmUsername}
                      type="name"
                      onChange={editconfirmUsername}
                      fullWidth
                    ></TextField>

                    <Typography
                      component="div"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        type="submit"
                        sx={{
                          backgroundColor: "#388E3C",
                          width: 400,
                          height: 50,
                        }}
                      >
                        {loading
                          ? "Updating..."
                          : usernameStatus
                          ? "success"
                          : "confirm"}
                      </Button>
                    </Typography>
                  </CardContent>
                </Card>
              </form>
            </Box>
          ) : passwordOpen ? (
            <Box
              sx={{
                // paddingX: 20,
                justifyContent: "center",
                margin: "0 auto",
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              <form onSubmit={submitPasswordChange}>
                <Card
                  sx={{
                    maxWidth: 450,
                    margin: "auto",
                    mt: 8,
                    padding: 2,
                  }}
                >
                  <Logo />

                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        textAlign: "left",
                        fontFamily: "'Roboto','sans-serif'",
                        fontSize: "36px",
                      }}
                      gutterBottom
                    >
                      Change Password
                    </Typography>
                    <TextField
                      label="Current Password"
                      margin="normal"
                      variant="outlined"
                      type="password"
                      value={currentPassword}
                      onChange={editCurrentPassword}
                      fullWidth
                    ></TextField>
                    <TextField
                      label="New Password"
                      margin="normal"
                      variant="outlined"
                      value={newPassword}
                      type="password"
                      onChange={editNewPassword}
                      fullWidth
                    ></TextField>

                    <Typography
                      component="div"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        type="submit"
                        sx={{
                          backgroundColor: "#388E3C",
                          width: 400,
                          height: 50,
                        }}
                      >
                        Confirm
                      </Button>
                    </Typography>
                  </CardContent>
                </Card>
              </form>
            </Box>
          ) : avatarOpen ? (
            <Box
              sx={{
                // paddingX: 20,
                justifyContent: "center",
                margin: "0 auto",
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              <form>
                <Card
                  sx={{
                    maxWidth: 450,
                    margin: "auto",
                    mt: 8,
                    padding: 2,
                  }}
                >
                  <Logo />

                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        textAlign: "left",
                        fontFamily: "'Roboto','sans-serif'",
                        fontSize: "36px",
                      }}
                      gutterBottom
                    >
                      Edit Avatar
                    </Typography>
                    <Typography className="flex flex-row">
                      <form>
                        <input
                          type="file"
                          accept="image/jpeg, image/png"
                          onChange={handleFileChange}
                        />
                      </form>
                      <Box>
                        {loading ? (
                          <PiSpinnerGapBold className="animate-spin" />
                        ) : uploadSuccess ? (
                          <VscCheck
                            style={{ color: "green", fontSize: "25px" }}
                          />
                        ) : (
                          // <VscChromeClose
                          //   style={{ color: "red", fontSize: "25px" }}
                          // />
                          ""
                        )}
                      </Box>
                    </Typography>

                    <Typography
                      component="div"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        type="button"
                        onClick={handleSubmit}
                        sx={{
                          backgroundColor: "#388E3C",
                          width: 400,
                          height: 50,
                        }}
                      >
                        {loading && uploadSuccess === false && "uploading..."}
                        {!loading && uploadSuccess === false && "upload"}
                        {!loading && uploadSuccess === true && "success"}
                        {/* {!loading && uploadSuccess === false && "failed"} */}
                      </Button>
                    </Typography>
                  </CardContent>
                </Card>
              </form>
            </Box>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
}
export default Setting;
