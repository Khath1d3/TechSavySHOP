import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header2 from "../../Components_test/Header2";
import Footer from "../../Components_test/Footer";
import "./AboutUsStyle.css";

function AboutUs() {
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
            <div className="aboutus-container">
                <h1 className="aboutus-title">About Us</h1>

                <section id="our-story" className="aboutus-section">
                    <h2>Our Story</h2>
                    <p>
                        Tech Savy was founded in 2020 with a simple mission: to make cutting-edge technology 
                        accessible to everyone. What started as a small online store has grown into a trusted 
                        destination for tech enthusiasts and everyday users alike.
                    </p>
                    <p>
                        We believe that technology should empower people, not intimidate them. That's why we 
                        carefully curate our product selection, offer expert guidance, and provide exceptional 
                        customer support every step of the way.
                    </p>
                </section>

                <section id="press" className="aboutus-section">
                    <h2>Press</h2>
                    <p>
                        Tech Savy has been featured in leading technology publications and news outlets. 
                        Our commitment to quality products and customer satisfaction has earned us recognition 
                        in the industry.
                    </p>
                    <div className="press-highlights">
                        <div className="press-item">
                            <h4>Tech Review Magazine - 2024</h4>
                            <p>"Best Online Electronics Retailer of the Year"</p>
                        </div>
                        <div className="press-item">
                            <h4>Digital Commerce Awards - 2023</h4>
                            <p>"Excellence in Customer Service"</p>
                        </div>
                        <div className="press-item">
                            <h4>Innovation Today - 2023</h4>
                            <p>"Top 10 E-commerce Platforms to Watch"</p>
                        </div>
                    </div>
                    <p>
                        For press inquiries, please contact us at: <strong>press@techsavy.com</strong>
                    </p>
                </section>

                <section id="careers" className="aboutus-section">
                    <h2>Careers</h2>
                    <p>
                        Join our growing team of passionate tech enthusiasts! At Tech Savy, we're always 
                        looking for talented individuals who share our vision of making technology accessible 
                        to everyone.
                    </p>
                    <p>
                        We offer competitive salaries, comprehensive benefits, and a dynamic work environment 
                        where innovation thrives. Whether you're interested in technology, customer service, 
                        logistics, or marketing, we have opportunities for you.
                    </p>
                    <div className="careers-benefits">
                        <h4>Why Work With Us?</h4>
                        <ul>
                            <li>Competitive salary and performance bonuses</li>
                            <li>Comprehensive health and wellness benefits</li>
                            <li>Professional development opportunities</li>
                            <li>Flexible work arrangements</li>
                            <li>Employee discount on all products</li>
                            <li>Collaborative and inclusive culture</li>
                        </ul>
                    </div>
                    <p>
                        Interested in joining our team? Send your resume to: <strong>careers@techsavy.com</strong>
                    </p>
                </section>

                <section id="terms-conditions" className="aboutus-section">
                    <h2>Terms & Conditions</h2>
                    <p>
                        By accessing and using Tech Savy's website and services, you agree to be bound by 
                        these terms and conditions. Please read them carefully.
                    </p>
                    
                    <h4>1. Use of Service</h4>
                    <p>
                        You must be at least 18 years old to make purchases on our website. You agree to 
                        provide accurate, current, and complete information during the registration and 
                        purchasing process.
                    </p>

                    <h4>2. Product Information</h4>
                    <p>
                        We strive to provide accurate product descriptions, images, and pricing. However, 
                        we do not warrant that product descriptions or other content is accurate, complete, 
                        reliable, current, or error-free.
                    </p>

                    <h4>3. Pricing and Availability</h4>
                    <p>
                        All prices are subject to change without notice. We reserve the right to limit 
                        quantities and discontinue products at any time. Product availability is not guaranteed.
                    </p>

                    <h4>4. Orders and Payment</h4>
                    <p>
                        All orders are subject to acceptance and availability. We reserve the right to refuse 
                        or cancel any order for any reason. Payment must be received before order processing.
                    </p>

                    <h4>5. Intellectual Property</h4>
                    <p>
                        All content on this website, including text, graphics, logos, and images, is the 
                        property of Tech Savy and protected by copyright laws.
                    </p>

                    <h4>6. Limitation of Liability</h4>
                    <p>
                        Tech Savy shall not be liable for any indirect, incidental, special, consequential, 
                        or punitive damages resulting from your use or inability to use the service.
                    </p>

                    <p className="terms-update">
                        <em>Last Updated: December 2025</em>
                    </p>
                </section>

                <section id="privacy-policy" className="aboutus-section">
                    <h2>Privacy Policy</h2>
                    <p>
                        At Tech Savy, we take your privacy seriously. This privacy policy explains how we 
                        collect, use, and protect your personal information.
                    </p>

                    <h4>Information We Collect</h4>
                    <p>
                        We collect information you provide directly to us, including name, email address, 
                        phone number, shipping address, and payment information. We also collect information 
                        about your browsing behavior and purchase history.
                    </p>

                    <h4>How We Use Your Information</h4>
                    <ul>
                        <li>Process and fulfill your orders</li>
                        <li>Communicate with you about your orders and account</li>
                        <li>Send promotional emails (you can opt-out at any time)</li>
                        <li>Improve our website and services</li>
                        <li>Prevent fraud and enhance security</li>
                        <li>Comply with legal obligations</li>
                    </ul>

                    <h4>Information Sharing</h4>
                    <p>
                        We do not sell your personal information to third parties. We may share your 
                        information with service providers who help us operate our business, such as 
                        payment processors and shipping companies.
                    </p>

                    <h4>Data Security</h4>
                    <p>
                        We implement appropriate technical and organizational measures to protect your 
                        personal information. However, no method of transmission over the internet is 
                        100% secure.
                    </p>

                    <h4>Your Rights</h4>
                    <p>
                        You have the right to access, update, or delete your personal information. You 
                        can also opt-out of marketing communications at any time.
                    </p>

                    <h4>Cookies</h4>
                    <p>
                        We use cookies to enhance your browsing experience and analyze website traffic. 
                        You can control cookie preferences through your browser settings.
                    </p>

                    <h4>Contact Us</h4>
                    <p>
                        If you have questions about this privacy policy, please contact us at: 
                        <strong> privacy@techsavy.com</strong>
                    </p>

                    <p className="terms-update">
                        <em>Last Updated: December 2025</em>
                    </p>
                </section>
            </div>
            <Footer />
        </>
    );
}

export default AboutUs;
