import React ,{useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components_test/Header";
import Footer from "../../Components_test/Footer";
import CartItem from "../../Components_test/CartItem";
import "./CartitemStyle.css";
import {useLoader} from "../../assets/LoaderContext";
import { AuthContext } from "../../assets/AuthContext";
import {getData} from "../../Components_test/ApiService";

function CartPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const [devices, setDevices] = useState([]);
    const { showLoader, hideLoader } = useLoader();
    const [message, setMessage] = useState("");
      const fetchProduct = async () => {
            if (!isLoggedIn) {
                setDevices([]);
                return;
            }
            
            showLoader();
            try {
            const data = await getData(`CustomerCart`, {includeRelated: true});
            if (data.success) {
                setDevices(data.data || []);
            } else {
                setDevices([]);
                setMessage(data.message || "No devices in the cart .");
            }
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
    console.log("devices in cart",devices);
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
                            onClick={() => navigate('/review-order')}
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
            <Footer />
        </>
    );
}
export default CartPage;
