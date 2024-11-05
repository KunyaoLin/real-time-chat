import BaseRoom from "./components/baseRoom";
import Login from "./components/login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./styles.css";
import Signup from "./components/signup";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Navigate to="/login" />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/menu" element={<BaseRoom />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
