import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header2 from "../../Components/Header2";
import Footer from "../../Components/Footer";
import "./CustomerCareStyle.css";

function CustomerCare() {
    const location = useLocation();

    useEffect(() => {
        // Scroll to section based on hash in URL
        if (location.hash) {
            const sectionId = location.hash.replace('#', '');
            const element = document.getElementById(sectionId);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    return (
        <>
            <Header2 />
            <div className="customercare-container">
                <h1 className="customercare-title">Customer Care</h1>

                <section id="help-center" className="customercare-section">
                    <h2>Help Center</h2>
                    <p>
                        Welcome to the Tech Savy Help Center! We're here to assist you with any questions 
                        or concerns you may have. Our comprehensive help resources are designed to provide 
                        quick answers to common questions.
                    </p>
                    
                    <h4>Frequently Asked Questions</h4>
                    <div className="faq-item">
                        <strong>Q: How do I create an account?</strong>
                        <p>Click on the "Sign Up" button in the header and fill out the registration form with your details.</p>
                    </div>
                    <div className="faq-item">
                        <strong>Q: Is my payment information secure?</strong>
                        <p>Yes, we use industry-standard encryption to protect your payment information.</p>
                    </div>
                    <div className="faq-item">
                        <strong>Q: Do you ship internationally?</strong>
                        <p>Currently, we ship within the United States. International shipping will be available soon.</p>
                    </div>
                    <div className="faq-item">
                        <strong>Q: Can I change my order after placing it?</strong>
                        <p>Please contact us immediately if you need to modify your order. We'll do our best to accommodate changes before shipment.</p>
                    </div>

                    <p>
                        Can't find what you're looking for? Contact our support team at: 
                        <strong> support@techsavy.com</strong>
                    </p>
                </section>

                <section id="how-to-buy" className="customercare-section">
                    <h2>How to Buy</h2>
                    <p>
                        Shopping at Tech Savy is easy and secure. Follow these simple steps to make your purchase:
                    </p>

                    <div className="steps-container">
                        <div className="step-item">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h4>Browse Products</h4>
                                <p>Explore our wide range of tech products. Use filters to narrow down your search.</p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h4>Add to Cart</h4>
                                <p>Click "Add to Cart" on products you want to purchase. Review your cart anytime.</p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h4>Create Account / Login</h4>
                                <p>Sign up for a new account or log in to your existing account to proceed.</p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h4>Enter Shipping Details</h4>
                                <p>Add or select your delivery address from your saved addresses.</p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">5</div>
                            <div className="step-content">
                                <h4>Choose Payment Method</h4>
                                <p>Select your preferred payment method and enter payment details securely.</p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">6</div>
                            <div className="step-content">
                                <h4>Review & Confirm</h4>
                                <p>Review your order details and confirm your purchase. You'll receive an order confirmation email.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="track-order" className="customercare-section">
                    <h2>Track Your Order</h2>
                    <p>
                        Stay updated on your order's journey from our warehouse to your doorstep!
                    </p>

                    <h4>How to Track Your Order</h4>
                    <ol className="tracking-steps">
                        <li>Log in to your Tech Savy account</li>
                        <li>Navigate to "My Account" and select "Track Order"</li>
                        <li>Find your order and click on "View Details"</li>
                        <li>Check the real-time status of your shipment</li>
                    </ol>

                    <h4>Order Status Guide</h4>
                    <div className="status-guide">
                        <div className="status-item">
                            <strong>Order Placed:</strong>
                            <p>Your order has been received and is being processed.</p>
                        </div>
                        <div className="status-item">
                            <strong>Processing:</strong>
                            <p>We're preparing your items for shipment.</p>
                        </div>
                        <div className="status-item">
                            <strong>Shipped:</strong>
                            <p>Your order is on its way! You'll receive a tracking number via email.</p>
                        </div>
                        <div className="status-item">
                            <strong>Out for Delivery:</strong>
                            <p>Your package is with the delivery driver and will arrive today.</p>
                        </div>
                        <div className="status-item">
                            <strong>Delivered:</strong>
                            <p>Your order has been successfully delivered!</p>
                        </div>
                    </div>

                    <p>
                        <strong>Note:</strong> Tracking information may take 24-48 hours to update after shipment.
                    </p>
                </section>

                <section id="returns-refunds" className="customercare-section">
                    <h2>Returns & Refunds</h2>
                    <p>
                        We want you to be completely satisfied with your purchase. If you're not happy with 
                        your order, we're here to help.
                    </p>

                    <h4>Return Policy</h4>
                    <ul>
                        <li>Items can be returned within 30 days of delivery</li>
                        <li>Products must be in original condition with all accessories and packaging</li>
                        <li>Items must not show signs of use or damage</li>
                        <li>Original receipt or proof of purchase is required</li>
                    </ul>

                    <h4>Non-Returnable Items</h4>
                    <ul>
                        <li>Opened software or downloadable products</li>
                        <li>Gift cards and vouchers</li>
                        <li>Personal care items (for hygiene reasons)</li>
                        <li>Customized or personalized products</li>
                    </ul>

                    <h4>How to Return an Item</h4>
                    <ol className="return-steps">
                        <li>Log in to your account and go to "Order History"</li>
                        <li>Select the order and click "Return Item"</li>
                        <li>Choose the reason for return and submit the request</li>
                        <li>Print the return label provided via email</li>
                        <li>Pack the item securely with all original packaging</li>
                        <li>Drop off the package at any authorized shipping location</li>
                    </ol>

                    <h4>Refund Process</h4>
                    <p>
                        Once we receive and inspect your return, we'll process your refund within 5-7 business days. 
                        The refund will be credited to your original payment method. Please allow 7-10 business days 
                        for the credit to appear on your statement.
                    </p>

                    <h4>Exchanges</h4>
                    <p>
                        If you'd like to exchange an item, please return the original item for a refund and place 
                        a new order for the desired product.
                    </p>
                </section>

                <section id="contact-us" className="customercare-section">
                    <h2>Contact Us</h2>
                    <p>
                        Have questions? We'd love to hear from you! Our customer support team is here to help.
                    </p>

                    <div className="contact-methods">
                        <div className="contact-method">
                            <h4>📧 Email Support</h4>
                            <p><strong>support@techsavy.com</strong></p>
                            <p>Response time: Within 24 hours</p>
                        </div>

                        <div className="contact-method">
                            <h4>📞 Phone Support</h4>
                            <p><strong>1-800-TECH-SAVY</strong></p>
                            <p>Mon-Fri: 9:00 AM - 6:00 PM EST</p>
                            <p>Sat-Sun: 10:00 AM - 4:00 PM EST</p>
                        </div>

                        <div className="contact-method">
                            <h4>💬 Live Chat</h4>
                            <p>Available on our website</p>
                            <p>Mon-Fri: 9:00 AM - 9:00 PM EST</p>
                            <p>Sat-Sun: 10:00 AM - 6:00 PM EST</p>
                        </div>

                        <div className="contact-method">
                            <h4>📍 Mailing Address</h4>
                            <p>Tech Savy Customer Service</p>
                            <p>123 Tech Street</p>
                            <p>Innovation City, CA 94000</p>
                            <p>United States</p>
                        </div>
                    </div>

                    <div className="contact-note">
                        <p>
                            <strong>Note:</strong> For faster assistance with order-specific inquiries, please have 
                            your order number ready when contacting us.
                        </p>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}

export default CustomerCare;
