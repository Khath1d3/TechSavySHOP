import { useNavigate } from "react-router-dom"; 
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getData } from '../Components/ApiService';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));
  const [redirectPath, setRedirectPath] = useState("/");
  const [userData, setUserData] = useState({ firstName: "", lastName: "" });
  const [isInitialized, setIsInitialized] = useState(false);

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
        const now = Date.now() / 1000;
        const isExpired = decoded.exp < now;
        const timeUntilExpiry = decoded.exp - now;
        return isExpired;
    } catch (error) {
        console.error("Token decode error:", error);
        return true; // Invalid token = treat as expired
    }
};

const fetchUserData = async (token) => {
    try {
        const response = await getData("me");
        if (response.success) {
            // Backend returns firstName and lastName directly in response, not nested in data
            setUserData({ 
                firstName: response.firstName || response.data?.firstName, 
                lastName: response.lastName || response.data?.lastName 
            });
        } else {
            console.error("Failed to fetch user data:", response.message);
            // Don't logout on failed user data fetch, user is still logged in
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        // Don't logout on error, user is still logged in
    }
};
useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
        if (!isTokenExpired(token)) {
            setIsLoggedIn(true);
            fetchUserData(token);
        } else {
            logout();
        }
    }
    setIsInitialized(true);
}, []);
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout , 
        userData ,requireAuth,setRedirectPath, redirectPath,isTokenExpired }}>
      {children}
    </AuthContext.Provider>
  );
};
