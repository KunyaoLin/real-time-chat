import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
} from "@mui/material";
import Logo from "./logo";
import axios from "axios";
import { showAlert } from "../ult/alert";
import { useNavigate } from "react-router-dom";
export function ForgetPassword() {
  const navigate = useNavigate();
  const URL = process.env.REACT_APP_SERVER_URL;
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (e) => {
    setSending(true);
    e.preventDefault();
    try {
      const response = await axios({
        method: "POST",
        url: `${URL}/forgetPassword`,
        data: {
          email,
        },
      });
      if (response.data.status === "success") {
        setSending(false);
        showAlert(
          "success",
          "Reset link was sent to your email, please check your email account!"
        );
        window.setTimeout(() => {
          window.location.assign("/login");
        }, 1500);
      }
    } catch (err) {
      setSending(false);
      showAlert("error", err.data.response.message);
    }

    // if (data.password === data.passwordConfirmed) {
    //   try {
    //     const res = await axios({
    //       method: "POST",
    //       url: `${URL}/resetPassword/${token}`,
    //       data: {
    //         password: data.password,
    //         passwordConfirmed: data.passwordConfirmed,
    //       },
    //       withCredentials: true,
    //     });
    //     if (res.data.status !== "success")
    //       throw new Error("reset password error");
    //     e.target.reset();
    //     showAlert("success", "password reset successfully");
    //     window.setTimeout(() => {
    //       window.location.assign("/menu");
    //     }, 1500);
    //   } catch (err) {
    //     console.log(err);
    //     showAlert("error", err.response.data.message);
    //   }
    // } else if (data.password !== data.passwordConfirmed) {
    //   alert("password not equal to passwordConfirmed");
    // }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Card
          sx={{
            width: 450,
            height: 500,
            margin: "auto",
            mt: 8,
            padding: 2,
          }}
        >
          <Logo />
          <CardContent
            sx={{ display: "flex", flexDirection: "column", mt: 2, gap: 3 }}
          >
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
              Email Address
            </Typography>

            <TextField
              variant="outlined"
              type="email"
              label="email"
              name="email"
              value={email}
              onChange={handleEmail}
            ></TextField>

            <Button type="submit" variant="contained">
              {sending ? "Sending..." : "Submit"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Box>
  );
}
