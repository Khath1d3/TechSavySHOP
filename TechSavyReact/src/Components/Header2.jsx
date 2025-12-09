import {Link,useLocation} from "react-router-dom";
import "../componentStyle/Header2style.css";
import Modal from "../Components/modal";
import { useState,useContext } from "react";
import Signup from "../Components/signup";
import Login from "../Components/login";
import ForgotPassword from "../Components/ForgotPassword";
import AccountList from "../Components/AccountList";
import { AuthContext } from "../assets/AuthContext";
import { useCart } from "../assets/CartContext";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import ProtectedLink from "../assets/ProtectedLink";
import { useNavigate } from "react-router-dom";

function Header2(){
const {isLoggedIn,logout,userData}=useContext(AuthContext);
const { cartCount } = useCart();
const [isLoginModalOpen, setIsLoginModalOpen] =useState(false);
const [isSignupModalOpen, setIsSignupModalOpen] =useState(false);
const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
const [showaccountList, setShowAccountList] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);
const location = useLocation();
const navigate = useNavigate();

const handleLogOut = () => {
    logout();
    navigate("/"); 
    setIsMobileMenuOpen(false);
}

const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
}

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
      <header className="shared-header">
        <div className="shared-header-top">
            <div className="shared-logo">
               <Link to="/"> <img src="images/logo2.png" alt="Tech Savy Shop Logo" /></Link>
            </div>

            {/* Hamburger Menu Icon */}
            <div className="shared-hamburger-menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>

            <nav className={`shared-nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <ul className="shared-nav-links">
                    <li onClick={closeMobileMenu}>
                        {location.pathname === "/product" ? (
                            <a className="shared-nav-link active">Product</a>
                        ) : (
                            <Link className="shared-item" to="/product">Product</Link>
                        )}
                    </li>
                
                    <li onMouseEnter={() => handleAccountHover(true)} onMouseLeave={() => handleAccountHover(false)}>
                        <a className="shared-item" id="loginBtn" onClick={handleAccountClick}>Account</a>
                        <ul className={`shared-accountInfo ${showaccountList ? 'show' : ''}`}>
                        {showaccountList && <AccountList closeMobileMenu={closeMobileMenu}/>}
                        </ul>
                    </li>

                    <li onClick={closeMobileMenu}>
                        {location.pathname === "/Cart" ? (
                            <a className="shared-nav-link active">
                                <span className="shared-cart-link">
                                    <img src="images/cart.png" alt="Cart" className="shared-cart-icon" />
                                    {isLoggedIn && cartCount > 0 && <span className="shared-cart-count">{cartCount}</span>}
                                </span>
                                Cart
                            </a>
                        ) : (
                            <ProtectedLink className="shared-item" to="/Cart">
                                <span className="shared-cart-link">
                                    <img src="images/cart.png" alt="Cart" className="shared-cart-icon" />
                                    {isLoggedIn && cartCount > 0 && <span className="shared-cart-count">{cartCount}</span>}
                                </span>
                                Cart
                            </ProtectedLink>
                        )}
                    </li>

                    {isLoggedIn ? (
                        <>
                            <li onClick={handleLogOut}>
                                <a className="shared-item Logoutbtn">Logout</a>
                            </li>
                            <li className="shared-user-info-mobile">
                                <FaUser className="icon"/>
                                <span>{userData.firstName}</span>
                            </li>
                        </>
                    ) : (
                        <>
                            <li onClick={() => {setIsSignupModalOpen(true); closeMobileMenu();}}>
                                <a className="shared-item" id="signupBtn">Sign Up</a>
                            </li>
                            <li onClick={() => {setIsLoginModalOpen(true); closeMobileMenu();}}>
                                <a className="shared-item" id="loginBtn">Login</a>
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
export default Header2;
