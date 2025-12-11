// Validation utility functions

// Text-only validation (letters, spaces, hyphens, apostrophes)
export const validateTextOnly = (value, fieldName = "Field") => {
  const strValue = String(value || "");
  
  if (!strValue || strValue.trim() === "") {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const textOnlyRegex = /^[a-zA-Z\s'-]+$/;
  if (!textOnlyRegex.test(strValue)) {
    return { isValid: false, error: `${fieldName} can only contain letters` };
  }
  
  return { isValid: true, error: "" };
};

// Number-only validation
export const validateNumberOnly = (value, fieldName = "Field") => {
  const strValue = String(value || "");
  
  if (!strValue || strValue.trim() === "") {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const numberOnlyRegex = /^\d+$/;
  if (!numberOnlyRegex.test(strValue)) {
    return { isValid: false, error: `${fieldName} can only contain numbers` };
  }
  
  return { isValid: true, error: "" };
};

// South African ID validation (13 digits, proper format)
export const validateSAID = (value) => {
  const strValue = String(value || "");
  
  if (!strValue || strValue.trim() === "") {
    return { isValid: false, error: "ID Number is required" };
  }
  
  // Remove any spaces
  const id = strValue.replace(/\s/g, "");
  
  // Check if it's exactly 13 digits
  if (!/^\d{13}$/.test(id)) {
    return { isValid: false, error: "ID Number must be exactly 13 digits" };
  }
  
  // Validate date portion (first 6 digits: YYMMDD)
  const year = parseInt(id.substring(0, 2));
  const month = parseInt(id.substring(2, 4));
  const day = parseInt(id.substring(4, 6));
  
  if (month < 1 || month > 12) {
    return { isValid: false, error: "Invalid month in ID Number" };
  }
  
  if (day < 1 || day > 31) {
    return { isValid: false, error: "Invalid day in ID Number" };
  }
  
  // Luhn algorithm check for SA ID
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    let digit = parseInt(id.charAt(i));
    if (i % 2 === 0) {
      sum += digit;
    } else {
      let doubled = digit * 2;
      sum += doubled > 9 ? doubled - 9 : doubled;
    }
  }
  
  if (sum % 10 !== 0) {
    return { isValid: false, error: "Invalid ID Number format" };
  }
  
  return { isValid: true, error: "" };
};

// South African phone number validation
export const validateSAPhone = (value) => {
  const strValue = String(value || "");
  
  if (!strValue || strValue.trim() === "") {
    return { isValid: false, error: "Phone number is required" };
  }
  
  // Remove spaces and hyphens
  const phone = strValue.replace(/[\s-]/g, "");
  
  // Check for +27 format (9 digits after +27)
  if (phone.startsWith("+27")) {
    if (!/^\+27\d{9}$/.test(phone)) {
      return { isValid: false, error: "Phone number must be +27 followed by 9 digits" };
    }
    return { isValid: true, error: "" };
  }
  
  // Check for 0 format (10 digits total)
  if (phone.startsWith("0")) {
    if (!/^0\d{9}$/.test(phone)) {
      return { isValid: false, error: "Phone number must be 10 digits starting with 0" };
    }
    return { isValid: true, error: "" };
  }
  
  return { isValid: false, error: "Phone number must start with +27 or 0" };
};

// Email validation
export const validateEmail = (value) => {
  const strValue = String(value || "");
  
  if (!strValue || strValue.trim() === "") {
    return { isValid: false, error: "Email is required" };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(strValue)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  
  return { isValid: true, error: "" };
};

// Password validation (min 8 chars, at least one uppercase, one lowercase, one number)
export const validatePassword = (value) => {
  const strValue = String(value || "");
  
  if (!strValue || strValue.trim() === "") {
    return { isValid: false, error: "Password is required" };
  }
  
  if (strValue.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters" };
  }
  
  if (!/[A-Z]/.test(strValue)) {
    return { isValid: false, error: "Password must contain at least one uppercase letter" };
  }
  
  if (!/[a-z]/.test(strValue)) {
    return { isValid: false, error: "Password must contain at least one lowercase letter" };
  }
  
  if (!/\d/.test(strValue)) {
    return { isValid: false, error: "Password must contain at least one number" };
  }
  
  return { isValid: true, error: "" };
};

// Postal code validation (4 digits)
export const validatePostalCode = (value) => {
  const strValue = String(value || "");
  
  if (!strValue || strValue.trim() === "") {
    return { isValid: false, error: "Postal code is required" };
  }
  
  if (!/^\d{4}$/.test(strValue)) {
    return { isValid: false, error: "Postal code must be exactly 4 digits" };
  }
  
  return { isValid: true, error: "" };
};

// Generic required field validation
export const validateRequired = (value, fieldName = "Field") => {
  const strValue = String(value || "");
  
  if (!strValue || strValue.trim() === "") {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true, error: "" };
};

// Address validation (allows letters, numbers, spaces, commas, periods, hyphens)
export const validateAddress = (value, fieldName = "Address") => {
  const strValue = String(value || "");
  
  if (!strValue || strValue.trim() === "") {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const addressRegex = /^[a-zA-Z0-9\s,.\-']+$/;
  if (!addressRegex.test(strValue)) {
    return { isValid: false, error: `${fieldName} contains invalid characters` };
  }
  
  return { isValid: true, error: "" };
};
