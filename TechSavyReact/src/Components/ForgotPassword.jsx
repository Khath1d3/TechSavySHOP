import React, { useState } from "react";
import { postData } from "./ApiService";

function ForgotPassword({ onBack }) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setMessage("Please enter your email address");
            setIsSuccess(false);
            return;
        }

        setIsLoading(true);
        setMessage("");

        try {
            // Replace with your actual API endpoint
            const response = await postData("ForgotPassword", { email });
            
            if (response.success) {
                setMessage("If an account exists with this email, a new password will be sent. Please check your email and change it after logging in.");
                setIsSuccess(true);
                setEmail("");
            } else {
                setMessage(response.message || "Unable to process request. Please try again.");
                setIsSuccess(false);
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            setMessage("An error occurred. Please try again later.");
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
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
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </span>
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
