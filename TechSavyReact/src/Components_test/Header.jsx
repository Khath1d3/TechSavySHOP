import { Link, useNavigate, useLocation } from "react-router-dom";
import Modal from "./modal";
import { use, useContext, useState } from "react";
import Login from "./login";
import Signup from "./signup";
import ForgotPassword from "./ForgotPassword";
import AccountList from "./AccountList";
import { AuthContext } from "../assets/AuthContext";
import { useCart } from "../assets/CartContext";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import {useLoader} from "../assets/LoaderContext";
import ProtectedLink from "../assets/ProtectedLink";

function Header(){
const {isLoggedIn,logout,userData}=useContext(AuthContext);
const { cartCount } = useCart();
const [isLoginModalOpen, setIsLoginModalOpen] =useState(false);
const [isSignupModalOpen, setIsSignupModalOpen] =useState(false);
const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
const [showaccountList, setShowAccountList] = useState(false);
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);
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


 return(
    <>
    <header className="landing-header">
    <div className="landing-header-top">
        <div className="landing-logo"><img src="img/logo.png" alt=""></img></div>
        
    
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
                                    <img src="images/cart.png" alt="Cart" className="landing-cart-icon" />
                                    {isLoggedIn && cartCount > 0 && <span className="landing-cart-count">{cartCount}</span>}
                                </span>
                                Cart
                            </a>
                        ) : (
                            <ProtectedLink className="landing-item" to="/Cart">
                                <span className="landing-cart-link">
                                    <img src="images/cart.png" alt="Cart" className="landing-cart-icon" />
                                    {isLoggedIn && cartCount > 0 && <span className="landing-cart-count">{cartCount}</span>}
                                </span>
                                Cart
                            </ProtectedLink>
                        )}
                    </li>
              {isLoggedIn ? (
                        <>
                            <li onClick={logout}>
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
    </div>
    
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
    </header>
    </>
 )
}
export default Header;