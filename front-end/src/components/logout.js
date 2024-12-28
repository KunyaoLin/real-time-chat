import React from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const URL = process.env.REACT_APP_SERVER_URL;
function Logout() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const answer = window.confirm("Do you want to log our your account?");
    try {
      const res = await axios({
        method: "GET",
        url: `${URL}/logout`,
        withCredentials: true,
      });
      if (res.data.status === "logout successfully" && answer)
        navigate("/login");
    } catch (err) {
      // console.log(err);
    }
  };
  return (
    <div>
      <Button
        variant="contained"
        onClick={handleLogout}
        sx={{
          mr: 2,
        }}
      >
        Logout
      </Button>
    </div>
  );
}
export default Logout;
