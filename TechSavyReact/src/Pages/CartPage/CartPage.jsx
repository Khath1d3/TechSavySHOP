import React ,{useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components_test/Header";
import Footer from "../../Components_test/Footer";
import CartItem from "../../Components_test/CartItem";
import "./CartitemStyle.css";
import {useLoader} from "../../assets/LoaderContext";
import { AuthContext } from "../../assets/AuthContext";
import {getData} from "../../Components_test/ApiService";
import { getGuestCart } from "../../assets/CartContext";
import Modal from "../../Components_test/modal";
import Login from "../../Components_test/login";

function CartPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const [devices, setDevices] = useState([]);
    const { showLoader, hideLoader } = useLoader();
    const [message, setMessage] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    
    const fetchGuestCartDetails = async () => {
        const guestCart = getGuestCart();
        console.log("Guest cart from localStorage:", guestCart);    
        if (guestCart.length === 0) {
            setDevices([]);
            return;
        }
        
        // Map localStorage items directly without additional API calls
        const cartItems = guestCart.map(item => ({
            id: item.productId,
            ProductID: item.productId,
            Name: item.name,
            Price: item.price,
            ImageLink: item.imageLink,
            Quantity: item.quantity,
            isGuestItem: true
        }));
        
        setDevices(cartItems);
    };
    
    const fetchProduct = async () => {
        if (!isLoggedIn) {
            fetchGuestCartDetails();
            return;
        }
        showLoader();
        try {
            // API returns { success: true, data: [...] }, empty array means no items
            const data = await getData(`CustomerCart`, {includeRelated: true});
            setDevices(data.data || []);
            } catch (error) {
            console.error("Error fetching product:", error);
            setMessage("Error fetching product. Please try again later.");
            } finally {
            hideLoader();
            }
        };
        useEffect(() => {
        fetchProduct();
        }, [isLoggedIn]);

    const totalPrice = devices.reduce((sum, d) => {
        const price = parseFloat(d?.Price ?? d?.price ?? 0);
        const qty = parseInt(d?.Quantity ?? d?.quantity ?? 1, 10) || 1;
        return sum + (isNaN(price) ? 0 : price) * qty;
    }, 0);
    
    const handleCheckout = () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }
        navigate('/review-order');
    };
    
    return (
        <>
            <Header />
            <h1 className="shoppingcartHeader">Shopping Cart</h1>
            <div className="shopping-cart-container">
                <div className="cart-section">
                    {devices.length === 0 && (<p>No devicies in the cart</p>)}
                    {devices.map((device) => (
                        <CartItem
                            key={device.id}
                            productid={device.ProductID}
                            name={device.Name}
                            quantity={device.Quantity}
                            price={device.Price}
                            imageURL={device.ImageLink}
                            Reload={fetchProduct}
                            isGuestItem={device.isGuestItem || false}
                        />
                    ))}
                </div>

                <div className="cart-cart-summary">
                    <div>
                        <h3>Cart Summary</h3>
                        <p>Total: ({devices.length} item/s)</p>
                        <p className="total-price">$ {totalPrice.toFixed(2)}</p>
                        <button 
                            className="checkout-btn" 
                            onClick={handleCheckout}
                            disabled={devices.length === 0}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                    <div className="summary-icons">
                        <p>✅ Secure checkout</p>
                        <p>💳 Many ways to pay</p>
                        <p>🚚 Fast, reliable delivery</p>
                    </div>
                </div>
            </div>
            
            {/* Login Modal */}
            <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
                <Login onSuccess={() => {
                    setShowLoginModal(false);
                    navigate('/review-order');
                }} />
            </Modal>
            
            <Footer />
        </>
    );
}
export default CartPage;
