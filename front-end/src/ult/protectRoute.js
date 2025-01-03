import axios from "axios";
import React, { useEffect, useState } from "react";
import { PiSpinnerGapBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const URL = process.env.REACT_APP_SERVER_URL;
function ProtectRoute({ children }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function checkLogin() {
      try {
        const res = await axios({
          method: "GET",
          url: `${URL}/api/auth`,
          withCredentials: true,
        });
        // console.log("resssss", res);
        if (isMounted && res.data.status === "success") {
          // console.log("success login rn");
          navigate("/dashboard");
        }
      } catch (err) {
        if (isMounted) {
          // console.log(err);
          navigate("/login");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    checkLogin();
    return () => {
      isMounted = false;
    };
  }, [navigate]);
  if (loading) {
    return (
      <div className=" flex justify-center items-center w-screen h-screen">
        <PiSpinnerGapBold
          style={{
            fontSize: "10vh",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  return children;
}
export default ProtectRoute;
