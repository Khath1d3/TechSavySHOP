import React, { useState } from "react";
import { postData } from "./ApiService";
import { 
  validateTextOnly, 
  validateEmail, 
  validateSAPhone, 
  validateSAID, 
  validatePassword 
} from "../utils/validation";
import { showSuccessToast, showErrorToast } from "../utils/toast";

function Signup({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    userType: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    idNumber: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState({});
  
  const handleSwitchToLogin = () => {
    if (typeof onSwitchToLogin === "function") {
      onSwitchToLogin();
    }
  };
  
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(prev => !prev);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(prev => !prev);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    // Validate first name
    const firstNameValidation = validateTextOnly(formData.firstName);
    if (!firstNameValidation.isValid) {
      newErrors.firstName = firstNameValidation.error;
    }
    
    // Validate last name
    const lastNameValidation = validateTextOnly(formData.lastName);
    if (!lastNameValidation.isValid) {
      newErrors.lastName = lastNameValidation.error;
    }
    
    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    
    // Validate phone number
    const phoneValidation = validateSAPhone(formData.phoneNumber);
    if (!phoneValidation.isValid) {
      newErrors.phoneNumber = phoneValidation.error;
    }
    
    // Validate ID number
    const idValidation = validateSAID(formData.idNumber);
    if (!idValidation.isValid) {
      newErrors.idNumber = idValidation.error;
    }
    
    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }
    
    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // If there are any errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showErrorToast("Please fix the errors in the form");
      return;
    }

    const requestData = { ...formData };
    delete requestData.confirmPassword;

    try {
      const response = await postData("register", requestData);
      if (response.success) {
        showSuccessToast("Registration successful! Welcome to Tech Savvy!");
        setMessage("Registration successful!");
        // Reset form
        setFormData({
          userType: "",
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          idNumber: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
      } else {
        showErrorToast(response.message || "Registration failed");
        setMessage(`Error: ${response.message || "Registration failed"}`);
      }
    } catch (error) {
      showErrorToast(error.message || "Registration failed");
      setMessage(`Error: ${error.message || "Registration failed"}`);
    }
  };
  
  return (
    <>
      <h2>Sign Up</h2>
      <form id="signupForm" onSubmit={handleSubmit}>
        <div className="password-container">
          <label htmlFor="firstName">First Name:</label>
          <span className="email-input-wrapper">
            <input
              id="firstName"
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </span>
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>

        <div className="password-container">
          <label htmlFor="lastName">Last Name:</label>
          <span className="email-input-wrapper">
            <input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </span>
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>

        <div className="password-container">
          <label htmlFor="email">Email:</label>
          <span className="email-input-wrapper">
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </span>
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="password-container">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <span className="email-input-wrapper">
            <input
              id="phoneNumber"
              type="text"
              name="phoneNumber"
              placeholder="Enter phone number (+27 or 0)"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </span>
          {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
        </div>

        <div className="password-container">
          <label htmlFor="idNumber">ID Number:</label>
          <span className="email-input-wrapper">
            <input
              id="idNumber"
              type="text"
              name="idNumber"
              placeholder="Enter 13-digit ID number"
              value={formData.idNumber}
              onChange={handleChange}
              required
            />
          </span>
          {errors.idNumber && <span className="error-message">{errors.idNumber}</span>}
        </div>

        <div className="password-container">
          <label htmlFor="password">Password:</label>
          <span className="password-input-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => togglePasswordVisibility('password')}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </span>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="password-container">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <span className="password-input-wrapper">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => togglePasswordVisibility('confirmPassword')}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </span>
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="btn">Register</button>
        <p>{message}</p>
      </form>
      <div className="login-option">
        <span>Already have an account? </span>
        <button
          type="button"
          className="login-link-btn"
          onClick={handleSwitchToLogin}
        >
          Log In
        </button>
      </div>
    </>
  );
}

export default Signup;
