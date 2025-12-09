import React, { useState } from "react";

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
 const handleSwitchToLogin = () => {
        if (typeof onSwitchToLogin === "function") {
            onSwitchToLogin();
        }
    };
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    const requestData = { ...formData };
    delete requestData.confirmPassword;

    const response = await fetch("https://localhost:7272/api/TechSavy/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      setMessage("Registration successful!");
    } else {
      const err = await response.json();
      setMessage(`Error: ${err.message || "Registration failed"}`);
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
            </div>

            <div className="password-container">
                <label htmlFor="phoneNumber">Phone Number:</label>
                <span className="email-input-wrapper">
                    <input
                    id="phoneNumber"
                    type="text"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    />
                </span>
            </div>

            <div className="password-container">
                <label htmlFor="idNumber">ID Number:</label>
                <span className="email-input-wrapper">
                    <input
                    id="idNumber"
                    type="text"
                    name="idNumber"
                    placeholder="Enter ID number"
                    value={formData.idNumber}
                    onChange={handleChange}
                    required
                    />
                </span>
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