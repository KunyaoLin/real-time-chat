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
import { useNavigate, useParams } from "react-router-dom";
import { showAlert } from "../ult/alert";
export function ResetPassword() {
  const { token } = useParams();
  const URL = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  //   const [password, setPassword] = useState("");
  //   const [passwordConfirmed, setpasswordConfirmed] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    console.log(data.password);
    console.log(data.passwordConfirmed);

    if (data.password === data.passwordConfirmed) {
      try {
        const res = await axios({
          method: "PATCH",
          url: `${URL}/resetPassword/${token}`,
          data: {
            password: data.password,
            passwordConfirmed: data.passwordConfirmed,
          },
          withCredentials: true,
        });
        if (res.data.status !== "success")
          throw new Error("reset password error");
        e.target.reset();
        showAlert("success", "password reset successfully");
        window.setTimeout(() => {
          window.location.assign("/dashboard");
        }, 1500);
      } catch (err) {
        console.log(err);
        showAlert("error", err.response.data.message);
      }
    } else if (data.password !== data.passwordConfirmed) {
      alert("password not equal to passwordConfirmed");
    }
  };
  //   const handlePassword = (e) => {
  //     setPassword(e.target.value);
  //   };
  //   const handlePasswordConfirmed = (e) => {
  //     setpasswordConfirmed(e.target.value);
  //   };

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
              Reset Your Password
            </Typography>

            <TextField
              variant="outlined"
              type="password"
              label="password"
              name="password"
              //   value={password}
              //   onChange={handlePassword}
            ></TextField>
            <TextField
              variant="outlined"
              type="password"
              name="passwordConfirmed"
              label="passwordConfirmed"
              //   value={passwordConfirmed}
              //   onChange={handlePasswordConfirmed}
            ></TextField>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </CardContent>
        </Card>
      </form>
    </Box>
  );
}
