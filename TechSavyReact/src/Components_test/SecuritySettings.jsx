import React, { useState } from "react";
import { postData } from "./ApiService";
import Modal from "./modal";
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
            return;
        }

        if (newPassword.length < 6) {
            setMessage("New password must be at least 6 characters long!");
            setMessageType("error");
            return;
        }

        try {
            const response = await postData("ChangePassword", {
                currentPassword,
                newPassword,
            });
            
            setMessage(response.message || "Password change failed");
            setMessageType(response.ok ? "success" : "error");

            if (response.ok) {
                setTimeout(() => {
                    setShowModal(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setMessage("");
                    setMessageType("");
                }, 2000);
            }
        } catch (error) {
            setMessage("Error: " + error.message);
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
                    
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input
                            id="currentPassword"
                            type="password"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
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
            </Modal>
        </div>
    );
}

export default SecuritySettings;
