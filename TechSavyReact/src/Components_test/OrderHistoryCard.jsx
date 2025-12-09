import React, { useState } from "react";
import "../componentStyle/invoicestyle.css";
import Modal from "./modal";

function OrderHistoryCard({ order }) {
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const maxVisibleImages = 3;
    const visibleProducts = order.products.slice(0, maxVisibleImages);
    const remainingCount = order.products.length - maxVisibleImages;
    const thirdProductImage = order.products.length > 2 ? order.products[2].productImage : null;

    return (
        <>
            <div className="invoice-card order-card">
                <div className="invoice-details order-info">
                    <div className="order-header">
                        <p className="order-number">Order #{order.orderID}</p>
                        <span className={`order-status status-${order.status?.toLowerCase()}`}>
                            {order.status}
                        </span>
                    </div>
                    <p className="order-date">
                        Ordered: {new Date(order.orderDate).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                    <p className="order-total">Total: ${order.totalAmount?.toFixed(2)}</p>
                    <button 
                        className="view-invoice-btn"
                        onClick={() => setShowDetailsModal(true)}
                    >
                        View Details
                    </button>
                </div>
                
                <div className="order-products-preview">
                    {visibleProducts.map((product, index) => (
                        <div key={product.productID} className="order-product-image">
                            <img src={product.productImage} alt={product.productName} />
                        </div>
                    ))}
                    {remainingCount > 0 && (
                        <div 
                            className="order-product-more"
                            style={{
                                backgroundImage: thirdProductImage ? `url(${thirdProductImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            <span className="order-remaining-overlay">+{remainingCount}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {showDetailsModal && (
                <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
                    <div className="order-details-modal">
                        <h2>Order Details</h2>
                        
                        <div className="order-detail-section">
                            <h3>Order Information</h3>
                            <div className="order-detail-grid">
                                <div className="detail-item">
                                    <strong>Order ID:</strong>
                                    <span>{order.orderID}</span>
                                </div>
                                <div className="detail-item">
                                    <strong>Order Date:</strong>
                                    <span>{new Date(order.orderDate).toLocaleDateString('en-GB')}</span>
                                </div>
                                <div className="detail-item">
                                    <strong>Status:</strong>
                                    <span className={`order-status status-${order.status?.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <strong>Total Amount:</strong>
                                    <span>${order.totalAmount?.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="order-detail-section">
                            <h3>Delivery Address</h3>
                            <div className="address-info">
                                <p><strong>{order.addressLabel}</strong></p>
                                <p>{order.addressLine1}</p>
                                <p>{order.city}, {order.postalCode}</p>
                                <p>{order.country}</p>
                            </div>
                        </div>

                        <div className="order-detail-section">
                            <h3>Payment Method</h3>
                            <p>{order.paymentMethod}</p>
                        </div>

                        <div className="order-detail-section">
                            <h3>Products ({order.products.length})</h3>
                            <div className="order-products-list">
                                {order.products.map((product) => (
                                    <div key={product.productID} className="order-product-item">
                                        <img src={product.productImage} alt={product.productName} />
                                        <div className="product-item-info">
                                            <p className="product-name">{product.productName}</p>
                                            <p className="product-price">${product.productPrice?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button 
                            className="close-modal-btn"
                            onClick={() => setShowDetailsModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}
export default OrderHistoryCard;