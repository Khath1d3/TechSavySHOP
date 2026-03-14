import React, { useState, useContext } from "react";
import { AuthContext } from "../assets/AuthContext";
import { useLoader } from "../assets/LoaderContext";
import { useNavigate } from "react-router-dom";
import { getData, postData } from "./ApiService"; 
import { validateEmail, validateRequired } from "../utils/validation";
import { showSuccessToast, showErrorToast } from "../utils/toast"; 

function Login({ onSuccess, onSwitchToSignup, onForgotPassword }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, redirectPath, setRedirectPath } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    if (typeof onForgotPassword === "function") {
      onForgotPassword();
    }
  };

  const handleSwitchToSignup = () => {
    if (typeof onSwitchToSignup === "function") {
      onSwitchToSignup();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isLoading) return;
    
    const newErrors = {};
    
    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    
    // Validate password
    const passwordValidation = validateRequired(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = "Password is required";
    }
    
    // If there are any errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showErrorToast("Please fix the errors in the form");
      return;
    }
    
    setIsLoading(true);
    showLoader();
    try {
      const response = await postData("Login", formData);
      console.log("Login response:", response);
      
      // Login returns { success: true, token, firstName, lastName, message } directly
      await login(response.token);
      
      // Guest cart sync now happens automatically in CartContext
      
      showSuccessToast(response.message || "Login successful!");
      if (typeof onSuccess === "function") onSuccess();
      if(redirectPath && redirectPath !== "/"){
        navigate(redirectPath, {replace: true});
        setRedirectPath("/"); 
      }
    } catch (error) {
      const errorMsg = error.message || "Login failed. Please try again.";
      setMessage(errorMsg);
      showErrorToast(errorMsg);
      console.error("Login error:", error);
    } finally {
      hideLoader();
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="modal-header">
        <h2>Welcome Back!</h2>
        <p className="modal-subtitle">Sign in to continue shopping</p>
      </div>
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
            maxLength={100}
            required
            disabled={isLoading}
          />
          </span>
          {errors.email && <span className="error-message">{errors.email}</span>}
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
              maxLength={64}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isLoading}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
            </span>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        
        <button type="submit" className="btn login-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="button-spinner">
              <span className="spinner"></span>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>
        
        {message && <p className="error-message">{message}</p>}
        
        <div className="login-options">
          <button
            type="button"
            className="forgot-password-link"
            onClick={handleForgotPassword}
            disabled={isLoading}
          >
            Forgot Password?
          </button>
          
          <div className="signup-option">
            <span>Don't have an account? </span>
            <button
              type="button"
              className="signup-link-btn"
              onClick={handleSwitchToSignup}
              disabled={isLoading}
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