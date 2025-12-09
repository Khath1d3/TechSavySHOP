import { useNavigate } from "react-router-dom"; 
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getData } from '../Components/ApiService';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));
  const [redirectPath, setRedirectPath] = useState("/");
  const [userData, setUserData] = useState({ firstName: "", lastName: "" });

   const login = (token, redirect = false) => {
    if (token) {
      sessionStorage.setItem("token", token);
      setIsLoggedIn(true);
      fetchUserData(token)
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUserData({ firstName: "", lastName: "" });
    setIsLoggedIn(false);
  };
    const requireAuth = (path) => {
        if (!isLoggedIn) {
        setRedirectPath(path); // Store the intended path
        return false; // Not authenticated
        }
        return true; // Already logged in
    };
  const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token); // Use 'jwt-decode' library
        return decoded.exp < Date.now() / 1000;
    } catch {
        return true; // Invalid token = treat as expired
    }
};

const fetchUserData = async (token) => {
    try {
        const response = await getData("me");
        if (response.success) {
            setUserData({ 
                firstName: response.data.firstName, 
                lastName: response.data.lastName 
            });
        } else {
            logout();
        }
    } catch {
        logout();
    }
};
useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token && !isTokenExpired(token)) {
        setIsLoggedIn(true);
        fetchUserData(token);
    } else {
        logout();
    }
}, []);
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout , 
        userData ,requireAuth,setRedirectPath, redirectPath,isTokenExpired }}>
      {children}
    </AuthContext.Provider>
  );
};
