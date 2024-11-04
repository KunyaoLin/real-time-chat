import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import Logo from "./logo";
const URL = process.env.REACT_APP_SERVER_URL;
function Signup() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmed, setPSWconfirmed] = useState("");
  const handleUsername = (e) => {
    setUserName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handlePWSconfirmed = (e) => {
    setPSWconfirmed(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { username, email, password, passwordConfirmed };
    try {
      if (
        username === "" ||
        email === "" ||
        password === "" ||
        passwordConfirmed === ""
      )
        throw new Error("Please complete your sign up form!");
      const response = await fetch(`${URL}/signup`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Sign up error!");
      setUserName("");
      setEmail("");
      setPassword("");
      setPSWconfirmed("");
      console.log(response);
    } catch (err) {
      console.log(err);
      alert(err);
    }
  };
  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="flex flex-col border border-1 mt-2 h-signup-h w-signup-w">
        <div className="px-4 py-4">
          {" "}
          <Logo />
        </div>
        <div className="px-8 py-2">
          {" "}
          <p className="font-roboto text-4xl text-gray-900 text-left ">
            Sign up
          </p>
        </div>
        <div>
          {" "}
          <form
            className="flex flex-col justify-center items-center"
            onSubmit={handleSubmit}
          >
            <TextField
              label="Username"
              margin="normal"
              id="userName"
              variant="outlined"
              value={username}
              onChange={handleUsername}
              fullWidth
              sx={{
                width: "386.02px",
                height: "60.98px",
              }}
            ></TextField>
            <TextField
              label="Email"
              type="email"
              margin="normal"
              variant="outlined"
              id="email"
              value={email}
              onChange={handleEmail}
              fullWidth
              sx={{
                width: "386.02px",
                height: "60.98px",
              }}
            ></TextField>
            <TextField
              label="Password"
              type="password"
              margin="normal"
              variant="outlined"
              id="password"
              value={password}
              onChange={handlePassword}
              fullWidth
              inputProps={{
                minLength: 8,
              }}
              sx={{
                width: "386.02px",
                height: "60.98px",
              }}
            ></TextField>
            <TextField
              label="Confirm Password"
              type="password"
              margin="normal"
              variant="outlined"
              id="ConfirmedPSD"
              fullWidth
              value={passwordConfirmed}
              onChange={handlePWSconfirmed}
              inputProps={{
                minLength: 8,
              }}
              sx={{
                width: "386.02px",
                height: "60.98px",
              }}
            ></TextField>
            <Button
              variant="contained"
              type="submit"
              sx={{
                width: "386px",
                mt: 2,
              }}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Signup;
