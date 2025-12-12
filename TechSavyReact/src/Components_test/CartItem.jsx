import React ,{useState, useEffect} from "react";
import {postData} from "./ApiService";
import {useLoader} from "../assets/LoaderContext";
import {useCart} from "../assets/CartContext";
import {useNavigate} from "react-router-dom";

function CartItem({ productid,name, quantity, price, imageURL,Reload }) {
    const { showLoader, hideLoader } = useLoader();
    const { updateCartCount } = useCart();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    console.log("productid",productid);
    const Remove = async () => {
        try {
        showLoader();
        await postData("RemoveFromCart",productid);
        updateCartCount(); // Update cart count after removing

        } catch (error) {
        console.error("Error fetching products:", error);
        setMessage("Error fetching products. Please try again later.");
        } finally {
        hideLoader();
        Reload();
        }
    };
    const Add=async()=>{
        try {
        showLoader();
        await postData("IncreaseQuantity",productid);
        updateCartCount(); // Update cart count after adding
        } catch (error) {
        console.error("Error moving to wishlist:", error);
        setMessage("Error moving to wishlist. Please try again later.");
        } finally {
        hideLoader();
        Reload();
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
                    <button className="cart-remove-btn" onClick={(e) => { e.stopPropagation(); Remove(); }}>-</button>
                    <button className="move-to-list-btn" onClick={(e) => { e.stopPropagation(); Add(); }}>+</button>
                </div>
            </div>
        </div>
        </>
    )
}
export default CartItem;
