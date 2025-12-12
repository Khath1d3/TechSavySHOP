import React from "react";
import { useState, useEffect } from "react";
import { getData, postData } from "./ApiService";
import { validateTextOnly, validateEmail, validateSAPhone, validateSAID } from "../utils/validation";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import "../componentStyle/PersonalStyle.css";

function PersonalDetails() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        idNumber: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await getData("GetUserDetails");
            const data = await response.data;
            setFormData({
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                email: data.email || "",
                phoneNumber: data.phoneNumber || "",
                idNumber: data.iDnumber || "",
            });
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setPageLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
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
        
        // If there are any errors, set them and stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showErrorToast("Please fix the errors in the form");
            return;
        }
        
        setLoading(true);
        try {
            const response = await postData("UpdateUserDetails", formData);
            if (response.success) {
                showSuccessToast("Details updated successfully!");
                setErrors({});
            } else {
                showErrorToast("Failed to update details. Please try again.");
            }
        } catch (error) {
            console.error("Error updating details:", error);
            showErrorToast("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <div>Loading...</div>;

    return (
        <div className="personal-details">
            <h2 className="personal-details__heading">Personal Details</h2>
            <form className="personal-details__form" onSubmit={handleSubmit}>
                <div className="personal-details__form-group">
                    <label className="personal-details__label" htmlFor="firstName">
                        First Name:
                    </label>
                    <input
                        className="personal-details__input"
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                <div className="personal-details__form-group">
                    <label className="personal-details__label" htmlFor="lastName">
                        Last Name:
                    </label>
                    <input
                        className="personal-details__input"
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
                <div className="personal-details__form-group">
                    <label className="personal-details__label" htmlFor="email">
                        Email:
                    </label>
                    <input
                        className="personal-details__input"
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="personal-details__form-group">
                    <label className="personal-details__label" htmlFor="phoneNumber">
                        Phone Number:
                    </label>
                    <input
                        className="personal-details__input"
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                    {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                </div>
                <div className="personal-details__form-group">
                    <label className="personal-details__label" htmlFor="idNumber">
                        ID Number:
                    </label>
                    <input
                        className="personal-details__input"
                        type="text"
                        id="idNumber"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleChange}
                        required
                        maxLength={13}
                        minLength={13}
                    />
                    {errors.idNumber && <span className="error-message">{errors.idNumber}</span>}
                </div>
                <div className="personal-details__form-group">
                    <button
                        className="personal-details__button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PersonalDetails;