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
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" or "error"
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChangePassword = async () => {
        const newErrors = {};
        
        // Validate current password
        const currentPasswordValidation = validateRequired(currentPassword);
        if (!currentPasswordValidation.isValid) {
            newErrors.currentPassword = "Current password is required";
        }
        
        // Validate new password
        const newPasswordValidation = validatePassword(newPassword);
        if (!newPasswordValidation.isValid) {
            newErrors.newPassword = newPasswordValidation.error;
        }
        
        // Check password confirmation
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        
        // If there are any errors, set them and stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showErrorToast("Please fix the errors in the form");
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
                showSuccessToast("Password changed successfully!");
                setTimeout(() => {
                    setShowModal(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setMessage("");
                    setMessageType("");
                    setErrors({});
                }, 2000);
            } else {
                showErrorToast(response.message || "Password change failed");
            }
        } catch (error) {
            const errorMsg = "Error: " + error.message;
            setMessage(errorMsg);
            setMessageType("error");
            showErrorToast(errorMsg);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage("");
        setMessageType("");
        setErrors({});
    };
    
    const handleInputChange = (field, value) => {
        if (field === 'currentPassword') setCurrentPassword(value);
        else if (field === 'newPassword') setNewPassword(value);
        else if (field === 'confirmPassword') setConfirmPassword(value);
        
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
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
                            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                        />
                        {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password (8+ chars, uppercase, lowercase, number)"
                            value={newPassword}
                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        />
                        {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
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
