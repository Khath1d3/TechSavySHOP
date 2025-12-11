import { Link, useNavigate, useLocation } from "react-router-dom";
import Modal from "./modal";
import { useContext, useState, useEffect } from "react";
import Login from "./login";
import Signup from "./signup";
import ForgotPassword from "./ForgotPassword";
import AccountList from "./AccountList";
import { AuthContext } from "../assets/AuthContext";
import { useCart } from "../assets/CartContext";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import {useLoader} from "../assets/LoaderContext";
import ProtectedLink from "../assets/ProtectedLink";

function Header({ isLandingPage = false }){
const {isLoggedIn,logout,userData}=useContext(AuthContext);
const { cartCount } = useCart();
const [isLoginModalOpen, setIsLoginModalOpen] =useState(false);
const [isSignupModalOpen, setIsSignupModalOpen] =useState(false);
const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
const [showaccountList, setShowAccountList] = useState(false);
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);
const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
const [logoutCountdown, setLogoutCountdown] = useState(2);
const location = useLocation();
const navigate = useNavigate();

const closeMobileMenu = () => {
    setIsMenuOpen(false);
};

const handleAccountClick = () => {
    if (isMobile) {
        setShowAccountList(!showaccountList);
    }
}

const handleAccountHover = (show) => {
    if (!isMobile) {
        setShowAccountList(show);
    }
}

const handleLogOut = () => {
    setIsLogoutModalOpen(true);
    setLogoutCountdown(2);
    setIsMenuOpen(false);
}

const confirmLogout = () => {
    logout();
    navigate("/"); 
    setIsLogoutModalOpen(false);
}

const cancelLogout = () => {
    setIsLogoutModalOpen(false);
    setLogoutCountdown(2);
}

useEffect(() => {
    let timer;
    if (isLogoutModalOpen && logoutCountdown > 0) {
        timer = setTimeout(() => {
            setLogoutCountdown(logoutCountdown - 1);
        }, 1000);
    } else if (isLogoutModalOpen && logoutCountdown === 0) {
        confirmLogout();
    }
    return () => clearTimeout(timer);
}, [isLogoutModalOpen, logoutCountdown]);

 return(
    <>
    {/* Mobile Menu Overlay */}
    {isMenuOpen && (
        <div 
            className="landing-mobile-overlay" 
            onClick={closeMobileMenu}
        />
    )}
    
    <header className="landing-header">
    <div className="landing-header-top">
        <div className="landing-logo">
            {isLandingPage ? (
                <img src="/images/logo.png" alt="Tech Savy Shop Logo" />
            ) : (
                <Link to="/"><img src="/images/logo2.png" alt="Tech Savy Shop Logo" /></Link>
            )}
        </div>
        
        {/* User Greeting - Mobile */}
        {isLoggedIn && (
            <div className="landing-user-greeting-mobile">
                <span>Hello {userData.firstName}</span>
            </div>
        )}
    
        {/* Hamburger Menu Icon */}
        <div className="landing-hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
        
        <nav className={`landing-nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <ul className="landing-nav-links">
                <li onClick={closeMobileMenu}><Link className="landing-item" to="/product">Product</Link></li>
                <li onMouseEnter={() => handleAccountHover(true)} onMouseLeave={() => handleAccountHover(false)}>
                        <a className="landing-item" id="loginBtn" onClick={handleAccountClick}>Account</a>
                        <ul className={`landing-accountInfo ${showaccountList ? 'show' : ''}`}>
                        {showaccountList && <AccountList closeMobileMenu={closeMobileMenu}/>}
                        </ul>
                    </li>
                <li onClick={closeMobileMenu}>
                        {location.pathname === "/Cart" ? (
                            <a className="landing-nav-link active">
                                <span className="landing-cart-link">
                                    <img src="/images/cart.png" alt="Cart" className="landing-cart-icon" />
                                    {isLoggedIn && cartCount > 0 && <span className="landing-cart-count">{cartCount}</span>}
                                </span>
                                Cart
                            </a>
                        ) : (
                            <ProtectedLink className="landing-item" to="/Cart">
                                <span className="landing-cart-link">
                                    <img src="/images/cart.png" alt="Cart" className="landing-cart-icon" />
                                    {isLoggedIn && cartCount > 0 && <span className="landing-cart-count">{cartCount}</span>}
                                </span>
                                Cart
                            </ProtectedLink>
                        )}
                    </li>
                    {isLoggedIn ? (
                        <>
                            <li onClick={handleLogOut}>
                                <a className="landing-item landing-logoutbtn">Logout</a>
                            </li>
                            <li className="landing-user-info-mobile">
                                <FaUser className="icon"/>
                                <span>{userData.firstName}</span>
                            </li>
                        </>
                    ) : (
                        <>
                            <li onClick={() => {setIsSignupModalOpen(true); closeMobileMenu();}}>
                                <a className="landing-item" id="signupBtn">Sign Up</a>
                            </li>
                            <li onClick={() => {setIsLoginModalOpen(true); closeMobileMenu();}}>
                                <a className="landing-item" id="loginBtn">Login</a>
                            </li>
                        </>
                    )}
            </ul>
        </nav>

        {/* User Greeting - Desktop */}
        {isLoggedIn && (
            <div className="landing-user-greeting-desktop">
                <span>Hello {userData.firstName}</span>
            </div>
        )}
    </div>
    </header>
    
    {/* Modals */}
    <Modal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)}>
        <Signup onSwitchToLogin={() => {
            setIsSignupModalOpen(false);
            setIsLoginModalOpen(true);
        }} />
    </Modal>
    <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <Login 
            onSuccess={() => setIsLoginModalOpen(false)}
            onSwitchToSignup={() => {
                setIsLoginModalOpen(false);
                setIsSignupModalOpen(true);
            }}
            onForgotPassword={() => {
                setIsLoginModalOpen(false);
                setIsForgotPasswordModalOpen(true);
            }}
        />
    </Modal>
    <Modal isOpen={isForgotPasswordModalOpen} onClose={() => setIsForgotPasswordModalOpen(false)}>
        <ForgotPassword onBack={() => {
            setIsForgotPasswordModalOpen(false);
            setIsLoginModalOpen(true);
        }} />
    </Modal>
    <Modal isOpen={isLogoutModalOpen} onClose={cancelLogout}>
        <div className="logout-confirmation">
            <h2>Logging out...</h2>
            <p>You will be logged out in {logoutCountdown} seconds</p>
            <div className="logout-actions">
                <button className="logout-cancel-btn" onClick={cancelLogout}>Cancel</button>
                <button className="logout-confirm-btn" onClick={confirmLogout}>Logout Now</button>
            </div>
        </div>
    </Modal>
    </>
 )
}
export default Header;