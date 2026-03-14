import React ,{useState, useEffect, useContext} from "react";
import {postData} from "./ApiService";
import {useLoader} from "../assets/LoaderContext";
import {useCart} from "../assets/CartContext";
import {useNavigate} from "react-router-dom";
import { AuthContext } from "../assets/AuthContext";
import { getGuestCart, setGuestCart, removeFromGuestCart } from "../assets/CartContext";

function CartItem({ productid, name, quantity, price, imageURL, Reload, isGuestItem }) {
    const { showLoader, hideLoader } = useLoader();
    const { updateCartCount } = useCart();
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [actionLoading, setActionLoading] = useState("");
    console.log("productid",productid);
    
    const Remove = async () => {
        if (actionLoading) return;
        setActionLoading("remove");

        if (!isLoggedIn || isGuestItem) {
            // Handle guest cart removal
            removeFromGuestCart(productid);
            updateCartCount();
            Reload();
            setActionLoading("");
            return;
        }
        
        try {
            showLoader();
            await postData("RemoveFromCart",productid);
            updateCartCount(); // Update cart count after removing
        } catch (error) {
            console.error("Error removing from cart:", error);
            setMessage("Error removing from cart. Please try again later.");
        } finally {
            hideLoader();
            Reload();
            setActionLoading("");
        }
    };
    
    const Add = async () => {
        if (actionLoading) return;
        setActionLoading("add");

        if (!isLoggedIn || isGuestItem) {
            // Handle guest cart increase
            const guestCart = getGuestCart();
            const item = guestCart.find(i => i.productId === productid);
            if (item) {
                item.quantity += 1;
                setGuestCart(guestCart);
                updateCartCount();
                Reload();
            }
            setActionLoading("");
            return;
        }
        
        try {
            showLoader();
            await postData("IncreaseQuantity",productid);
            updateCartCount(); // Update cart count after adding
        } catch (error) {
            console.error("Error increasing quantity:", error);
            setMessage("Error increasing quantity. Please try again later.");
        } finally {
            hideLoader();
            Reload();
            setActionLoading("");
        }
    };
    return(
        <>
              <div className="cart-cart-item" onClick={() => navigate(`/viewitem/${productid}`)} style={{cursor: 'pointer'}}>
            <div className="cart-cart-item-image">
                <img src={imageURL} />
            </div>
            <div className="cart-cart-item-details">
                <h3>{name}</h3>
                <p className="shipping-time">Ships in 5 - 7 work days</p>
                <div className="cart-item-actions">
                    <span className="price">$ {price}</span>
                    <div className="quantity">
                        Qty:
                        <label htmlFor="quantity">{quantity}</label>
                    </div>
                    <button
                        className="cart-remove-btn"
                        onClick={(e) => { e.stopPropagation(); Remove(); }}
                        disabled={Boolean(actionLoading)}
                    >
                        {actionLoading === "remove" ? "Removing..." : "-"}
                    </button>
                    <button
                        className="move-to-list-btn"
                        onClick={(e) => { e.stopPropagation(); Add(); }}
                        disabled={Boolean(actionLoading)}
                    >
                        {actionLoading === "add" ? "Adding..." : "+"}
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}
export default CartItem;
