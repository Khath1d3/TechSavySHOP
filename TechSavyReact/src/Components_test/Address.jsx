import React from 'react';

function AddressBook({ address, isSelected, onSelect, onEdit, onDelete, isSelecting, disabled }) {
  console.log(address);
    return (
      <div className={`address-option ${isSelected ? 'selected' : ''} ${isSelecting ? 'loading' : ''} ${disabled ? 'disabled' : ''}`} onClick={() => !disabled && onSelect(address.addressID)}>
        <input 
          type="radio" 
          checked={isSelected} 
          onChange={() => !disabled && onSelect(address.addressID)} 
          disabled={disabled}
          name="address"
        />
        <div className="address-content">
          <p><strong>{address.addressLabel}</strong></p>
          <p>{address.addressLine1}</p>
          <p>{address.city}, {address.postalCode}</p>
          {isSelecting && <p className="address-updating">Updating...</p>}
        </div>
  
        {isSelected && (
          <div className="actions">
            <button disabled={disabled} onClick={(e) => { e.stopPropagation(); onEdit(address.addressID); }}>Edit</button>
            <button disabled={disabled} onClick={(e) => { e.stopPropagation(); onDelete(address.addressID); }}>Delete</button>
          </div>
        )}
      </div>
    );
  };
  export default AddressBook;