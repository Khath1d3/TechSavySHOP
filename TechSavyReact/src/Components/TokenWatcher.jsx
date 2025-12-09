// components/TokenWatcher.jsx
import { useEffect, useContext } from "react";
import { useNavigate }          from "react-router-dom";
import { AuthContext }          from "../assets/AuthContext";

export default function TokenWatcher() {
  const { isTokenExpired, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    /** run immediately + every minute */
    const checkToken = () => {
      const token = sessionStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        logout();                       // clear state + sessionStorage
        navigate("/", { replace: true }); // 👉 send user to landing
      }
    };

    checkToken();                       // run once on mount
    const id = setInterval(checkToken, 60_000); // every 60 s
    return () => clearInterval(id);     // cleanup
  }, [isTokenExpired, logout, navigate]);

  return null;                          // renders nothing
}
