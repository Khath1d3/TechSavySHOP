import React, { useState } from "react";
import Modal from "./modal";

function InvoiceCard({ invoice }) {
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Convert API field names to lowercase first letter
    const invoiceData = {
        orderID: invoice.orderID,
        invoiceDate: invoice.invoiceDate,
        amountDue: invoice.amountDue,
        paymentReference: invoice.paymentReference,
        status: invoice.status,
        orderDate: invoice.orderDate,
        orderItems: invoice.orderItems?.map(item => ({
            productID: item.productID,
            productName: item.productName,
            productImage: item.productImage,
            productPrice: item.productPrice
        })) || []
    };

    const maxVisibleImages = 3;
    const visibleProducts = invoiceData.orderItems.slice(0, maxVisibleImages);
    const remainingCount = invoiceData.orderItems.length - maxVisibleImages;
    const fourthProductImage = invoiceData.orderItems.length > 3 ? invoiceData.orderItems[3].productImage : null;

    return(
        <>
            <div className="invoice-card order-card">
                <div className="invoice-details order-info">
                    <div className="order-header">
                        <p className="order-number">Order #{invoiceData.orderID}</p>
                        <span className={`order-status status-${invoiceData.status?.toLowerCase()}`}>
                            {invoiceData.status}
                        </span>
                    </div>
                    <p className="order-date">
                        Placed: {new Date(invoiceData.orderDate).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                    <p className="order-total">Amount: ${invoiceData.amountDue?.toFixed(2)}</p>
                    <button 
                        className="view-invoice-btn"
                        onClick={() => setShowDetailsModal(true)}
                    >
                        View Invoice
                    </button>
                </div>
                
                <div className="order-products-preview">
                    {visibleProducts.map((product, index) => (
                        <div key={product.productID} className="order-product-image">
                            <img 
                                src={product.productImage} 
                                alt={product.productName}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/images/placeholder.png';
                                }}
                            />
                        </div>
                    ))}
                    {remainingCount > 0 && (
                        <div 
                            className="order-product-more"
                            style={{
                                backgroundImage: fourthProductImage ? `url(${fourthProductImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            <span className="order-remaining-overlay">+{remainingCount}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Invoice Details Modal */}
            {showDetailsModal && (
                <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
                    <div className="order-details-modal">
                        <div className="modal-header-fixed">
                            <h2>Invoice Details</h2>
                        </div>
                        <div className="modal-body-scrollable">
                            <div className="order-detail-section">
                            <h3>Invoice Information</h3>
                            <div className="order-detail-grid">
                                <div className="detail-item">
                                    <strong>Order ID:</strong>
                                    <span>{invoiceData.orderID}</span>
                                </div>
                                <div className="detail-item">
                                    <strong>Invoice Date:</strong>
                                    <span>{new Date(invoiceData.invoiceDate).toLocaleDateString('en-GB')}</span>
                                </div>
                                <div className="detail-item">
                                    <strong>Order Date:</strong>
                                    <span>{new Date(invoiceData.orderDate).toLocaleDateString('en-GB')}</span>
                                </div>
                                <div className="detail-item">
                                    <strong>Status:</strong>
                                    <span className={`order-status status-${invoiceData.status?.toLowerCase()}`}>
                                        {invoiceData.status}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <strong>Amount Due:</strong>
                                    <span>${invoiceData.amountDue?.toFixed(2)}</span>
                                </div>
                                <div className="detail-item">
                                    <strong>Payment Reference:</strong>
                                    <span>{invoiceData.paymentReference || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="order-detail-section">
                            <h3>Order Items</h3>
                            <div className="order-items-list">
                                {invoiceData.orderItems.map((item) => (
                                    <div key={item.productID} className="order-item-card">
                                        <img 
                                            src={item.productImage} 
                                            alt={item.productName}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/placeholder.png';
                                            }}
                                        />
                                        <div className="order-item-details">
                                            <h4>{item.productName}</h4>
                                            <p className="item-price">${item.productPrice?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
export default InvoiceCard;