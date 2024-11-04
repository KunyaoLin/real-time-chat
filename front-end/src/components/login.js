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
import { useNavigate } from "react-router-dom";
import Logo from "./logo";
const PROT = process.env.REACT_APP_LOGIN_URL;
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handPasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = { email, password };
    console.log(message);
    try {
      const response = await fetch(`${PROT}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(message),
      });
      const data = await response.json();
      console.log(response);
      console.log(data);
      if (!data) throw new Error("Something wrong:");
    } catch (err) {
      console.log(err);
    }
  };
  const handleSignup = () => {
    navigate("/signup");
  };
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundImage:
          "url(https://t3.ftcdn.net/jpg/03/55/60/70/360_F_355607062_zYMS8jaz4SfoykpWz5oViRVKL32IabTP.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        // backgroundColor: "#9BBBD4",
      }}
    >
      <Box
        sx={{
          // paddingX: 20,
          justifyContent: "center",
          margin: "0 auto",
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
        }}
        //把框框设置成包含两个的内容，左边是登陆，右边的对话动画
      >
        <form onSubmit={handleSubmit}>
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
                Login in
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
                  type="submit"
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
                  onClick={handleSignup}
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
        </form>
      </Box>
    </Box>
  );
}

export default Login;
