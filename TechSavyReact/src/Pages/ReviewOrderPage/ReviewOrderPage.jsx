import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header2 from "../../Components_test/Header2";
import Footer from "../../Components_test/Footer";
import Modal from "../../Components_test/modal";
import { getData, postData } from "../../Components_test/ApiService";
import { useLoader } from "../../assets/LoaderContext";
import { useCart } from "../../assets/CartContext";
import "./ReviewOrderStyle.css";

function ReviewOrderPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showLoader, hideLoader } = useLoader();
    const { updateCartCount } = useCart();

    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showAddNewAddressModal, setShowAddNewAddressModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const [voucherCode, setVoucherCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [voucherApplied, setVoucherApplied] = useState(false);
    const [voucherMessage, setVoucherMessage] = useState("");
    const [message, setMessage] = useState("");
    const [countdown, setCountdown] = useState(5);
    const [newAddressForm, setNewAddressForm] = useState({
        addressLabel: '',
        addressLine1: '',
        city: '',
        postalCode: ''
    });

    // Fetch cart items
    const fetchCartItems = async () => {
        showLoader();
        try {
            const data = await getData("CustomerCart", { includeRelated: true });
            setCartItems(data.data || []);
            // Store cartId if available in response
            if (data.data[0].CartID) {
                setCartId(data.data[0].CartID);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            setMessage("Error loading cart items.");
        } finally {
            hideLoader();
        }
    };

    // Fetch user addresses
    const fetchAddresses = async () => {
        try {
            const response = await getData("GetUserAddress");
            if (response.success) {
                setAddresses(response.data || []);
                const selected = response.data.find(addr => addr.isSelected);
                setSelectedAddress(selected);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };
     const fetchPaymentMethods = async () => {
        try {
            const response = await getData("GetPaymentDetails");
            if (response.success) {
                setPaymentMethods(response.data || []);
                // Set first payment method as default
                if (response.data && response.data.length > 0) {
                    setSelectedPaymentId(response.data[0].paymentID || response.data[0].paymentId);
                }
            }
        } catch (error) {
            console.error("Error fetching payment methods:", error);
        }
    };
    useEffect(() => {
        fetchCartItems();
        fetchAddresses();
        fetchPaymentMethods()
    }, []);

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
        const price = parseFloat(item?.Price ?? item?.price ?? 0);
        const qty = parseInt(item?.Quantity ?? item?.quantity ?? 1, 10) || 1;
        return sum + (isNaN(price) ? 0 : price) * qty;
    }, 0);

    const shipping = subtotal > 100 ? 0 : 10;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal + shipping - discountAmount;

    // Handle voucher application
    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) {
            setVoucherMessage("Please enter a voucher code");
            return;
        }

        try {
            showLoader();
            const response = await postData("ApplyVoucher", { voucherCode });
            
            if (response.success) {
                setDiscount(response.discountPercentage || 10);
                setVoucherApplied(true);
                setVoucherMessage(`Voucher applied! ${response.discountPercentage || 10}% discount`);
            } else {
                setVoucherMessage(response.message || "Invalid voucher code");
                setDiscount(0);
                setVoucherApplied(false);
            }
        } catch (error) {
            setVoucherMessage("Error applying voucher");
            setDiscount(0);
            setVoucherApplied(false);
        } finally {
            hideLoader();
        }
    };

    // Handle address change
    const handleChangeAddress = async (addressId) => {
        try {
            const response = await postData("ChangeisSelectedAddress", { addressid: addressId });
            if (response.success) {
                await fetchAddresses();
                setShowAddressModal(false);
            }
        } catch (error) {
            console.error("Error changing address:", error);
        }
    };

    // Handle add new address
    const handleAddNewAddress = async () => {
        if (!newAddressForm.addressLabel || !newAddressForm.addressLine1 || !newAddressForm.city || !newAddressForm.postalCode) {
            setMessage("Please fill all address fields");
            return;
        }

        try {
            showLoader();
            const response = await postData("AddAddress", newAddressForm);
            if (response.success) {
                await fetchAddresses();
                setShowAddNewAddressModal(false);
                setNewAddressForm({ addressLabel: '', addressLine1: '', city: '', postalCode: '' });
                setMessage("Address added successfully");
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage(response.message || "Failed to add address");
            }
        } catch (error) {
            console.error("Error adding address:", error);
            setMessage("Error adding address");
        } finally {
            hideLoader();
        }
    };

    // Handle payment
    const handlePay = async () => {
        console.log("selectedAddress",selectedAddress);
        console.log("selectedPaymentId",selectedPaymentId);
        console.log("cartId",cartId);
        if (!selectedAddress) {
            setMessage("Please select a delivery address");
            return;
        }

        if (!selectedPaymentId) {
            setMessage("Please select a payment method");
            return;
        }

        if (!cartId) {
            setMessage("Cart information not available");
            return;
        }

        if (cartItems.length === 0) {
            setMessage("Your cart is empty");
            return;
        }

        try {
            showLoader();
            const orderData = {
                cartId: cartId,
                paymentId: selectedPaymentId,
                addressId: selectedAddress.addressID
            };
            console.log("orderData",orderData);
            const response = await postData("CreateOrder", orderData);
            console.log(response);
            if (response.success) {
                updateCartCount();
                console.log("Order created successfully");
                setShowSuccessModal(true);
                
                // Start countdown timer
                let timer = 5;
                const interval = setInterval(() => {
                    timer -= 1;
                    setCountdown(timer);
                    if (timer === 0) {
                        clearInterval(interval);
                        navigate("/product");
                    }
                }, 1000);
            } else {
                setMessage(response.message || "Order failed. Please try again.");
            }
        } catch (error) {
            console.error("Error creating order:", error);
            setMessage("Error processing order. Please try again.");
        } finally {
            hideLoader();
        }
    };

    // Handle success modal close
    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        navigate("/product");
    };

    return (
        <>
            <Header2 />
            <div className="review-order-container">
                <h1 className="review-order-title">Review Your Order</h1>

                {message && <div className="alert-message">{message}</div>}

                <div className="review-order-content">
                    {/* Left Section - Order Details */}
                    <div className="order-details-section">
                        {/* Delivery Address */}
                        <div className="review-card">
                            <div className="review-card-header">
                                <h2>Delivery Address</h2>
                                <button 
                                    className="change-btn" 
                                    onClick={() => setShowAddressModal(true)}
                                >
                                    Change
                                </button>
                            </div>
                            {selectedAddress ? (
                                <div className="review-address-details">
                                    <p className="review-address-label">{selectedAddress.addressLabel}</p>
                                    <p>{selectedAddress.addressLine1}</p>
                                    <p>{selectedAddress.city}, {selectedAddress.postalCode}</p>
                                </div>
                            ) : (
                                <p className="no-address">No address selected. Please select one.</p>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="review-card">
                            <h2>Payment Method</h2>
                            <div className="review-payment-methods">
                                {paymentMethods.length > 0 ? (
                                    paymentMethods.map((method) => (
                                        <label key={method.paymentID || method.paymentId} className="review-payment-option">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method.paymentID || method.paymentId}
                                                checked={selectedPaymentId === (method.paymentID || method.paymentId)}
                                                onChange={(e) => setSelectedPaymentId(parseInt(e.target.value))}
                                            />
                                            <span>💳 {method.paymentMethod}</span>
                                        </label>
                                    ))
                                ) : (
                                    <p>No payment methods available</p>
                                )}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="review-card">
                            <h2>Order Items ({cartItems.length})</h2>
                            <div className="order-items-list">
                                {cartItems.map((item) => (
                                    <div 
                                        key={item.ProductID} 
                                        className="order-item"
                                        onClick={() => navigate(`/viewitem/${item.ProductID}`)}
                                        style={{cursor: 'pointer'}}
                                    >
                                        <img 
                                            src={item.ImageLink} 
                                            alt={item.Name} 
                                            className="item-image"
                                        />
                                        <div className="item-details">
                                            <h3>{item.Name}</h3>
                                            <p className="item-quantity">Quantity: {item.Quantity}</p>
                                        </div>
                                        <p className="item-price">${(item.Price * item.Quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Order Summary */}
                    <div className="review-order-summary-section">
                        <div className="summary-card">
                            <h2>Order Summary</h2>
                            
                            {/* Voucher Section */}
                            <div className="review-voucher-section">
                                <h3>Have a Voucher?</h3>
                                <div className="review-voucher-input-group">
                                    <input
                                        type="text"
                                        placeholder="Enter voucher code"
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                        disabled={voucherApplied}
                                    />
                                    <button 
                                        onClick={handleApplyVoucher}
                                        disabled={voucherApplied}
                                        className={voucherApplied ? "applied" : ""}
                                    >
                                        {voucherApplied ? "Applied" : "Apply"}
                                    </button>
                                </div>
                                {voucherMessage && (
                                    <p className={`voucher-message ${voucherApplied ? "success" : "error"}`}>
                                        {voucherMessage}
                                    </p>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="price-breakdown">
                                <div className="price-row">
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="price-row">
                                    <span>Shipping:</span>
                                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                {voucherApplied && (
                                    <div className="price-row discount">
                                        <span>Discount ({discount}%):</span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="price-row total">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button className="pay-btn" onClick={handlePay}>
                                Pay ${total.toFixed(2)}
                            </button>

                            <div className="security-badges">
                                <p>🔒 Secure Payment</p>
                                <p>✅ Money-back Guarantee</p>
                                <p>🚚 Fast Delivery</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Selection Modal */}
            <Modal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)}>
                <div className="review-address-modal">
                    <h2>Select Delivery Address</h2>
                    <button 
                        className="review-add-address-btn"
                        onClick={() => {
                            setShowAddressModal(false);
                            setShowAddNewAddressModal(true);
                        }}
                    >
                        + Add New Address
                    </button>
                    <div className="review-address-list">
                        {addresses.map((address) => (
                            <div 
                                key={address.addressID} 
                                className={`address-option ${address.isSelected ? "selected" : ""}`}
                                onClick={() => handleChangeAddress(address.addressID)}
                            >
                                <div className="review-address-radio">
                                    <input
                                        type="radio"
                                        name="address"
                                        checked={address.isSelected}
                                        readOnly
                                    />
                                </div>
                                <div className="review-address-info">
                                    <p className="review-address-label">{address.addressLabel}</p>
                                    <p>{address.addressLine1}</p>
                                    <p>{address.city}, {address.postalCode}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {addresses.length === 0 && (
                        <p className="no-addresses">No addresses found. Please add one below.</p>
                    )}
                </div>
            </Modal>

            {/* Add New Address Modal */}
            <Modal isOpen={showAddNewAddressModal} onClose={() => setShowAddNewAddressModal(false)}>
                <div className="review-add-address-modal">
                    <h2>Add New Address</h2>
                    <div className="review-address-form">
                        <div className="review-form-group">
                            <label>Address Label (e.g., Home, Work)</label>
                            <input
                                type="text"
                                placeholder="Home"
                                value={newAddressForm.addressLabel}
                                onChange={(e) => setNewAddressForm({...newAddressForm, addressLabel: e.target.value})}
                            />
                        </div>
                        <div className="review-form-group">
                            <label>Address Line</label>
                            <input
                                type="text"
                                placeholder="Street address"
                                value={newAddressForm.addressLine1}
                                onChange={(e) => setNewAddressForm({...newAddressForm, addressLine1: e.target.value})}
                            />
                        </div>
                        <div className="review-form-group">
                            <label>City</label>
                            <input
                                type="text"
                                placeholder="City"
                                value={newAddressForm.city}
                                onChange={(e) => setNewAddressForm({...newAddressForm, city: e.target.value})}
                            />
                        </div>
                        <div className="review-form-group">
                            <label>Postal Code</label>
                            <input
                                type="text"
                                placeholder="Postal Code"
                                value={newAddressForm.postalCode}
                                onChange={(e) => setNewAddressForm({...newAddressForm, postalCode: e.target.value})}
                            />
                        </div>
                        <div className="review-form-actions">
                            <button className="review-save-address-btn" onClick={handleAddNewAddress}>
                                Save Address
                            </button>
                            <button 
                                className="review-cancel-btn" 
                                onClick={() => {
                                    setShowAddNewAddressModal(false);
                                    setShowAddressModal(true);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Success Modal */}
            <Modal isOpen={showSuccessModal} onClose={() => {}}>
                <div className="success-modal">
                    <div className="success-icon">✅</div>
                    <h2>Order Created Successfully!</h2>
                    <p>Your order has been placed successfully.</p>
                    <p className="order-details-text">
                        Please refer to your email for confirmation or check Track Order on the system.
                    </p>
                    <p className="countdown-text">
                        Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
                    </p>
                    <button className="success-btn" onClick={handleSuccessClose}>
                        Continue Shopping
                    </button>
                </div>
            </Modal>

            <Footer />
        </>
    );
}

export default ReviewOrderPage;

