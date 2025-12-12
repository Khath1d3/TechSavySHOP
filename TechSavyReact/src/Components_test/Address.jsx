import React from 'react';

function AddressBook({ address, isSelected, onSelect, onEdit, onDelete }) {
  console.log(address);
    return (
      <div className={`address-option ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(address.addressID)}>
        <input 
          type="radio" 
          checked={isSelected} 
          onChange={() => onSelect(address.addressID)} 
          name="address"
        />
        <div className="address-content">
          <p><strong>{address.addressLabel}</strong></p>
          <p>{address.addressLine1}</p>
          <p>{address.city}, {address.postalCode}</p>
        </div>
  
        {isSelected && (
          <div className="actions">
            <button onClick={(e) => { e.stopPropagation(); onEdit(address.addressID); }}>Edit</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(address.addressID); }}>Delete</button>
          </div>
        )}
      </div>
    );
  };
  export default AddressBook;