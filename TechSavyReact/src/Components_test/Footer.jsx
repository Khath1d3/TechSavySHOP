import { Link } from "react-router-dom";

function Footer(){
    return(
        <>
            <footer>
                <div className="shared-footer-section">
                    <h3>Customer Care</h3>
                    <ul>
                        <li><Link to="/customer-care#help-center">Help Center</Link></li>
                        <li><Link to="/customer-care#how-to-buy">How to Buy</Link></li>
                        <li><Link to="/customer-care#track-order">Track Your Order</Link></li>
                        <li><Link to="/customer-care#returns-refunds">Returns & Refunds</Link></li>
                        <li><Link to="/customer-care#contact-us">Contact Us</Link></li>
                    </ul>
                </div>
                <div className="shared-footer-section">
                    <h3>About Us</h3>
                    <ul>
                        <li><Link to="/about-us#our-story">Our Story</Link></li>
                        <li><Link to="/about-us#press">Press</Link></li>
                        <li><Link to="/about-us#careers">Careers</Link></li>
                        <li><Link to="/about-us#terms-conditions">Terms & Conditions</Link></li>
                        <li><Link to="/about-us#privacy-policy">Privacy Policy</Link></li>
                    </ul>
                </div>
                <div className="shared-footer-section">
                    <h3>Connect With Us</h3>
                    <ul>
                        <li>Facebook</li>
                        <li>Twitter</li>
                        <li>Instagram</li>
                        <li>YouTube</li>
                        <li>LinkedIn</li>
                    </ul>
                </div>
                <div className="shared-footer-section">
                    <h3>Payment Options</h3>
                    <ul>
                        <li>Visa</li>
                        <li>MasterCard</li>
                        <li>PayPal</li>
                        <li>Discover</li>
                        <li>American Express</li>
                    </ul>
                </div>
            </footer>   
        </>
    )
}
export default Footer;
