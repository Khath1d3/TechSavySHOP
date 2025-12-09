import React from "react";
import { useState, useEffect } from "react";
import { getData, postData } from "./ApiService";
import "../componentStyle/PersonalStyle.css";

function PersonalDetails() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        idNumber: "",
    });
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await postData("UpdateUserDetails", formData);
            if (response.success) {
                alert("Details updated successfully!");
            } else {
                alert("Failed to update details. Please try again.");
            }
        } catch (error) {
            console.error("Error updating details:", error);
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