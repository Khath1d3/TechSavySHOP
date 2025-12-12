import React, { useState } from "react";
import { postData } from "./ApiService";
import Modal from "./modal";
import { validatePassword, validateRequired } from "../utils/validation";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import "../componentStyle/SecuritySettingsStyle.css";

function SecuritySettings() {
    const [showModal, setShowModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" or "error"
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage("New passwords do not match!");
            setMessageType("error");
            showErrorToast("New passwords do not match!");
            return;
        }

        if (newPassword.length < 6) {
            setMessage("New password must be at least 6 characters long!");
            setMessageType("error");
            showErrorToast("New password must be at least 6 characters long!");
            return;
        }

        try {
            const response = await postData("ChangePassword", {
                currentPassword,
                newPassword,
            });
            
            setMessage(response.message || "Password change failed");
            setMessageType(response.success ? "success" : "error");

            if (response.success) {
                showSuccessToast(response.message || "Password changed successfully!");
                setTimeout(() => {
                    setShowModal(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setMessage("");
                    setMessageType("");
                }, 2000);
            } else {
                showErrorToast(response.message || "Password change failed");
            }
        } catch (error) {
            setMessage("An error occurred while changing the password.");
            setMessageType("error");
            showErrorToast("An error occurred while changing the password.");
            setMessageType("error");
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage("");
        setMessageType("");
    };

    return (
        <div className="security-settings">
            <div className="security-settings-header">
                <h2>Security Settings</h2>
            </div>
            
            <div className="security-settings-content">
                <div className="security-card">
                    <div className="security-card-header">
                        <h3>Password</h3>
                        <p>Change your account password</p>
                    </div>
                    <button className="change-password-btn" onClick={() => setShowModal(true)}>
                        Change Password
                    </button>
                </div>
            </div>

            <Modal isOpen={showModal} onClose={handleCloseModal}>
                <div className="change-password-modal">
                    <h3>Change Password</h3>
                    <p className="modal-description">Enter your current password and choose a new one</p>
                    
                    <div className="modal-form-content">
                        <div className="form-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                                >
                                    {showCurrentPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                                >
                                    {showNewPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>
                        
                        {message && (
                            <p className={`message ${messageType}`}>{message}</p>
                        )}
                        
                        <div className="modal-actions">
                            <button className="btn btn-primary" onClick={handleChangePassword}>
                                Change Password
                            </button>
                            <button className="btn btn-secondary" onClick={handleCloseModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default SecuritySettings;
