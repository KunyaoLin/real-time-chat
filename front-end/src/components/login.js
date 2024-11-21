import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  Box,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "./logo";
import { showAlert } from "../ult/alert";
import { useAuth } from "../context/globalContext";
const URL = process.env.REACT_APP_SERVER_URL;
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { editAuthenticated } = useAuth();
  const handEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handPasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleForgetPassword = () => {
    navigate("/forgetPassword");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios({
        method: "POST",
        url: `${URL}/login`,
        data: {
          email,
          password,
        },
        withCredentials: true,
      });
      if (res.data.status === "success") {
        showAlert("success", "login successfully");
        editAuthenticated("login");
        setEmail("");
        setPassword("");
        window.setTimeout(() => {
          window.location.assign("/dashboard");
        }, 1500);
      }
    } catch (err) {
      if (err.status === 401)
        showAlert("error", "Incorrect Email and password");
      setEmail("");
      setPassword("");
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
                type="email"
                value={email}
                onChange={handEmailChange}
                fullWidth
              ></TextField>
              <TextField
                label="Password"
                margin="normal"
                variant="outlined"
                value={password}
                type="password"
                onChange={handPasswordChange}
                fullWidth
              ></TextField>

              <Typography
                onClick={handleForgetPassword}
                variant="body2"
                color="blue"
                sx={{ mt: 2, cursor: "pointer" }}
              >
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
