import { Button, TextField } from "@mui/material";
import Logo from "./logo";

function Signup() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const userName = e.target.elements.userName.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    console.log(userName);
    console.log(email);
    console.log(password);
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
              //   value={email}
              //   onChange={handEmailChange}
              fullWidth
              sx={{
                width: "386.02px",
                height: "60.98px",
              }}
            ></TextField>
            <TextField
              label="Email"
              margin="normal"
              variant="outlined"
              id="email"
              fullWidth
              sx={{
                width: "386.02px",
                height: "60.98px",
              }}
            ></TextField>
            <TextField
              label="Password"
              margin="normal"
              variant="outlined"
              id="password"
              fullWidth
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
                mt: 4,
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
