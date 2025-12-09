import React, { useState, useEffect } from "react";
import "../componentStyle/addressBookStyle.css";
import AddressOption from "./Address";
import Modal from "./modal";
import { getData, postData } from "./ApiService";

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

    const openAddModal = () => {
        setModalMode('add');
        setFormData({ addressLabel: '', addressLine1: '', city: '', postalCode: '' });
        setShowModal(true);
    };
    
    const openEditModal = (id) => {
        const addr = addresses.find(a => a.addressID === id);
        setModalMode('edit');
        setFormData(addr);
        setShowModal(true);
    };

    const openDeleteModal = (id) => {
        setModalMode('delete');
        setFormData({ id });
        setShowModal(true);
    };

    const handleSave =async () => {
        if (modalMode === 'add') {
              try {
                    const response = await postData("AddAddress", formData);
                    if (response.success) {
                        console.log("Address saved successfully");
                        UserAddress();
                    }
                } catch (error) {
                    console.error("Error saving address:", error);
                }
        } else if (modalMode === 'edit') {
                try {
                    const response = await postData("UpdateAddress", formData);
                    if (response.success) {
                        console.log("Address updated successfully");
                        UserAddress();
                    }
                } catch (error) {
                    console.error("Error updating address:", error);
                }
        }
        setShowModal(false);
    };

    const handleDelete = async (addressid) => {
          try {
                    const intergerclass={addressid:formData.id}
                    const response = await postData("DeleteAddress", intergerclass);
                    if (response.success) {
                        console.log("Address Deleted successfully");
                        UserAddress();
                    }
                } catch (error) {
                    console.error("Error deleting address:", error);
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
                                onChange={(e) => setFormData({ ...formData, addressLabel: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="addressStreet">Street Address</label>
                            <input
                                id="addressStreet"
                                type="text"
                                placeholder="Enter street address"
                                value={formData.addressLine1}
                                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="addressCity">City</label>
                            <input
                                id="addressCity"
                                type="text"
                                placeholder="Enter city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="addressZip">Zip Code</label>
                            <input
                                id="addressZip"
                                type="text"
                                placeholder="Enter zip code"
                                value={formData.postalCode}
                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                required
                            />
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