import Login from "./components/login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles.css";
import Signup from "./components/signup";
import { ResetPassword } from "./components/resetPassword";
import { ForgetPassword } from "./components/forgetPassword";
import Dashboard from "./components/dashbBoard";
import ProtectRoute from "./ult/protectRoute";
import { GlobalContextProvider } from "./context/globalContext";
function App() {
  return (
    // <GlobalContextProvider>
    <BrowserRouter future={{ v7_startTransition: true }}>
      <Routes>
        <Route path="*" element={<Navigate to="/login" replace />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/forgetPassword" element={<ForgetPassword />}></Route>
        <Route path="/resetPassword/:token" element={<ResetPassword />}></Route>
        <Route
          path="/dashboard"
          element={
            <GlobalContextProvider>
              <ProtectRoute>
                <Dashboard />
              </ProtectRoute>
            </GlobalContextProvider>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
    // </GlobalContextProvider>
  );
}

export default App;
