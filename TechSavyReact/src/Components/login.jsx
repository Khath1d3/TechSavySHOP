import React, { useState, useContext } from "react";
import { AuthContext } from "../assets/AuthContext";
import { useLoader } from "../assets/LoaderContext";
import { useNavigate } from "react-router-dom";
import { getData,postData } from "./ApiService"; 

function Login({ onSuccess, onSwitchToSignup, onForgotPassword }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, redirectPath, setRedirectPath } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    if (typeof onForgotPassword === "function") {
      onForgotPassword();
    } else {
      // Default behavior - you can implement forgot password logic here
      alert("Forgot password functionality coming soon!");
    }
  };

  const handleSwitchToSignup = () => {
    if (typeof onSwitchToSignup === "function") {
      onSwitchToSignup();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    try {
      const response = await postData("Login", formData);
      console.log("Login response:", response);
      if (response.success) {
        const data = await response;
        console.log("Login data received:", { hasToken: !!data.token, tokenLength: data.token?.length });
        await login(data.token);  
        if (typeof onSuccess === "function") onSuccess();
        if(redirectPath && redirectPath !== "/"){
          navigate(redirectPath, {replace: true});
          setRedirectPath("/"); 
        }
      } else {
        const err = await response.json();
        setMessage(`${err.message || "Login failed"}`);
      }
    } catch (error) {
      setMessage("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      hideLoader();
    }
  };

  return (
    <>
      <h2>Login</h2>
      <form id="loginForm" onSubmit={handleSubmit}>
        <div className="password-container">
          <label htmlFor="loginEmail">Email:</label>
         <span className="email-input-wrapper">
            <input
            id="loginEmail"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          </span>
        </div>
        <div className="password-container">
          <label htmlFor="loginPassword">Password:</label>
            <span className="password-input-wrapper">
              <input
              id="loginPassword"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
            </span>
        </div>
        
        <button type="submit" className="btn login-btn">
          Login
        </button>
        
        {message && <p className="error-message">{message}</p>}
        
        <div className="login-options">
          <button
            type="button"
            className="forgot-password-link"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </button>
          
          <div className="signup-option">
            <span>Don't have an account? </span>
            <button
              type="button"
              className="signup-link-btn"
              onClick={handleSwitchToSignup}
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;