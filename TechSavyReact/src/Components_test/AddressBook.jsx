import React, { useState, useEffect } from "react";
import "../componentStyle/AddressBookStyle.css";
import AddressOption from "./Address";
import Modal from "./modal";
import { getData, postData } from "./ApiService";
import { validateTextOnly, validatePostalCode, validateAddress } from "../utils/validation";
import { showSuccessToast, showErrorToast } from "../utils/toast";

function AddressBook() {
    // Initialize addresses as an empty array
    const [addresses, setAddresses] = useState([]); // Change here

    const UserAddress = async () => {
        try {
            const response = await getData("GetUserAddress");
            if (response.success) {
                setAddresses(response.data); 
                console.log("Fetched addresses:", response.data);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };
    
    useEffect(() => {
        UserAddress();
    }, []);

    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState(null); // 'add', 'edit', or 'delete'
    const [formData, setFormData] = useState({ addressLabel: '', addressLine1: '', city: '', postalCode: '' });
    const [errors, setErrors] = useState({});

    const openAddModal = () => {
        setModalMode('add');
        setFormData({ addressLabel: '', addressLine1: '', city: '', postalCode: '' });
        setErrors({});
        setShowModal(true);
    };
    
    const openEditModal = (id) => {
        const addr = addresses.find(a => a.addressID === id);
        setModalMode('edit');
        setFormData(addr);
        setErrors({});
        setShowModal(true);
    };

    const openDeleteModal = (id) => {
        setModalMode('delete');
        setFormData({ id });
        setShowModal(true);
    };

    const handleSave = async () => {
        const newErrors = {};
        
        // Validate address label (allow letters, numbers, spaces for names like "Home 2", "Office 3")
        const labelValidation = validateAddress(formData.addressLabel);
        if (!labelValidation.isValid) {
            newErrors.addressLabel = labelValidation.error;
        }
        
        // Validate address line
        const addressValidation = validateAddress(formData.addressLine1);
        if (!addressValidation.isValid) {
            newErrors.addressLine1 = addressValidation.error;
        }
        
        // Validate city (text only)
        const cityValidation = validateTextOnly(formData.city);
        if (!cityValidation.isValid) {
            newErrors.city = cityValidation.error;
        }
        
        // Validate postal code (4 digits)
        const postalValidation = validatePostalCode(formData.postalCode);
        if (!postalValidation.isValid) {
            newErrors.postalCode = postalValidation.error;
        }
        
        // If there are any errors, set them and stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showErrorToast("Please fix the errors in the form");
            return;
        }
        
        if (modalMode === 'add') {
              try {
                    const response = await postData("AddAddress", formData);
                    if (response.success) {
                        console.log("Address saved successfully");
                        showSuccessToast("Address added successfully!");
                        UserAddress();
                        setShowModal(false);
                        setErrors({});
                    } else {
                        showErrorToast("Failed to add address");
                    }
                } catch (error) {
                    console.error("Error saving address:", error);
                    showErrorToast("An error occurred while saving address");
                }
        } else if (modalMode === 'edit') {
                try {
                    const response = await postData("UpdateAddress", formData);
                    if (response.success) {
                        console.log("Address updated successfully");
                        showSuccessToast("Address updated successfully!");
                        UserAddress();
                        setShowModal(false);
                        setErrors({});
                    } else {
                        showErrorToast("Failed to update address");
                    }
                } catch (error) {
                    console.error("Error updating address:", error);
                    showErrorToast("An error occurred while updating address");
                }
        }
    };

    const handleDelete = async (addressid) => {
          try {
                    const intergerclass={addressid:formData.id}
                    const response = await postData("DeleteAddress", intergerclass);
                    if (response.success) {
                        console.log("Address Deleted successfully");
                        showSuccessToast("Address deleted successfully!");
                        UserAddress();
                    } else {
                        showErrorToast("Failed to delete address");
                    }
                } catch (error) {
                    console.error("Error deleting address:", error);
                    showErrorToast("An error occurred while deleting address");
                }
        setShowModal(false);
    };
    const ChangeSelectedAddress = async (addressid) => {
    try {
            const intergerclass={addressid:addressid}
            console.log("Selected Address ID:", addressid);
            const response = await postData("ChangeisSelectedAddress", intergerclass);
            if (response.success) {
                console.log("Address selected successfully");
                UserAddress();
            }
        } catch (error) {
            console.error("Error selecting address:", error);
        }
    }
    
    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    return (
        <div className="address-book">
            <h2>Address Book</h2>
            <div className="btnCont">
                <button className="add-address-btn" onClick={openAddModal}>Add New Address</button>
            </div>
            <div className="address-list">
                {addresses.length === 0 ? (
                    <p className="no-addresses">No addresses available</p>
                ) : (
                    addresses.map((addr) => (
                        <AddressOption 
                            key={addr.id}
                            address={addr}
                            isSelected={ addr.isSelected}
                            onSelect={ChangeSelectedAddress}
                            onEdit={() => openEditModal(addr.addressID)}
                            onDelete={() => openDeleteModal(addr.addressID)}
                        />
                    ))
                )}
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                {modalMode === 'delete' ? (
                    <>
                        <h3>Delete Address?</h3>
                        <p>Are you sure you want to delete this address?</p>
                        <div className="modal-buttons">
                            <button onClick={handleDelete} className="btn-confirm">Delete</button>
                            <button onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3>{modalMode === 'add' ? 'Add New Address' : 'Edit Address'}</h3>
                        
                        <div className="form-group">
                            <label htmlFor="addressName">Name</label>
                            <input
                                id="addressName"
                                type="text"
                                placeholder="Enter address name (e.g., Home, Office)"
                                value={formData.addressLabel}
                                onChange={(e) => handleInputChange('addressLabel', e.target.value)}
                                required
                            />
                            {errors.addressLabel && <span className="error-message">{errors.addressLabel}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="addressStreet">Street Address</label>
                            <input
                                id="addressStreet"
                                type="text"
                                placeholder="Enter street address"
                                value={formData.addressLine1}
                                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                                required
                            />
                            {errors.addressLine1 && <span className="error-message">{errors.addressLine1}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="addressCity">City</label>
                            <input
                                id="addressCity"
                                type="text"
                                placeholder="Enter city"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                required
                            />
                            {errors.city && <span className="error-message">{errors.city}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="addressZip">Zip Code</label>
                            <input
                                id="addressZip"
                                type="text"
                                placeholder="Enter 4-digit zip code"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                required
                                maxLength={4}
                            />
                            {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
                        </div>

                        <div className="modal-buttons">
                            <button onClick={handleSave} className="btn-confirm">Save</button>
                            <button onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}

export default AddressBook;