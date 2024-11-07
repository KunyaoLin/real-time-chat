import React from "react";
import { Button } from "@mui/material";
// import { useAuth } from "../Context/routeProctect";

function Logout() {
  //   const { logout } = useAuth();
  const handleLogout = () => {
    // logout();
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
