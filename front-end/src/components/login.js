import React, { useState } from "react";
import {
  Card,
  Box,
  IconButton,
  InputAdornment,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handPasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        // backgroundImage:
        //   "url(https://images.unsplash.com/photo-1487088678257-3a541e6e3922?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        // backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundColor: "#9BBBD4",
      }}
    >
      <Box
        sx={{}}
        //把框框设置成包含两个的内容，左边是登陆，右边的对话动画
      >
        <Card
          sx={{
            maxWidth: 450,
            //   backgroundColor: "rgba(255, 255, 255, 0.7)",
            margin: "auto",
            mt: 8,
            padding: 2,
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              sx={{ textAlign: "center" }}
              gutterBottom
            >
              Welcome to Chat Room
            </Typography>
            <TextField
              label="Email"
              margin="normal"
              variant="outlined"
              value={email}
              onChange={handEmailChange}
              fullWidth
            ></TextField>
            <TextField
              label="Password"
              margin="normal"
              variant="outlined"
              value={password}
              type={showPassword ? "text" : "password"}
              onChange={handPasswordChange}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            ></TextField>

            <Typography
              variant="body2"
              color="blue"
              sx={{ mt: 2, cursor: "pointer" }}
            >
              {" "}
              Forget Password?
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
                sx={{
                  backgroundColor: "#388E3C",
                  width: 200,
                  height: 50,
                }}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                sx={{
                  backgroundColor: "transparent",
                  width: 200,
                  height: 50,
                }}
              >
                Sign Up
              </Button>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Login;
