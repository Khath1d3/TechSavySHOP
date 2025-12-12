import React, { useState } from "react";
import { postData } from "./ApiService";
import { validateEmail } from "../utils/validation";
import { showSuccessToast, showErrorToast } from "../utils/toast";

function ForgotPassword({ onBack }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate email
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            setError(emailValidation.error);
            showErrorToast(emailValidation.error);
            return;
        }

        // Feature not available
        showErrorToast("Sorry, this feature does not work :(");
        setMessage("Sorry, this feature does not work :(");
        setIsSuccess(false);
    };

    const handleBackToLogin = () => {
        if (typeof onBack === "function") {
            onBack();
        }
    };

    return (
        <>
            <h2>Forgot Password</h2>
            <p className="forgot-password-description">
                Enter your email address and we'll send you a new password if an account exists.
            </p>
            
            <form id="forgotPasswordForm" onSubmit={handleSubmit}>
                <div className="password-container">
                    <label htmlFor="forgotEmail">Email:</label>
                    <span className="email-input-wrapper">
                        <input
                            id="forgotEmail"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            disabled={isLoading}
                        />
                    </span>
                    {error && <span className="error-message">{error}</span>}
                </div>

                <button 
                    type="submit" 
                    className="btn forgot-password-btn"
                    disabled={isLoading}
                >
                    {isLoading ? "Sending..." : "Send New Password"}
                </button>

                {message && (
                    <p className={`forgot-password-message ${isSuccess ? "success-message" : "error-message"}`}>
                        {message}
                    </p>
                )}

                <div className="back-to-login">
                    <button
                        type="button"
                        className="back-to-login-btn"
                        onClick={handleBackToLogin}
                    >
                        ← Back to Login
                    </button>
                </div>
            </form>
        </>
    );
}

export default ForgotPassword;
