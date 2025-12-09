import react from "react";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { postData } from "./ApiService";
import { AuthContext } from "../assets/AuthContext";
import { useCart } from "../assets/CartContext";
import Modal from "./modal";
import Login from "./login";

function DeviceCard({ id, name, category, price, originalPrice, imageURL, rating, isOnSale }) {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const { updateCartCount } = useCart();
    const [loading, setLoading] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    
    const handleClick = () => {
      addToRecentlyViewed(id);
      navigate(`/viewitem/${id}`);
    };
    function addToRecentlyViewed(productId) {
        let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

        // remove if it already exists so we can push it to front
        viewed = viewed.filter(id => id !== productId);

        viewed.unshift(productId); // add to front (most recent)

        // limit to last 10
        if(viewed.length > 10) viewed.pop();

        localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
    }
    const handleAddToCart = async () => {
        try {
            const productId = parseInt(id, 10);
            await postData('AddToCart', productId);
            console.log('Added to cart successfully');
            updateCartCount(); // Update cart count after adding
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleAddClick = async (e) => {
        e.stopPropagation();
        
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        try {
            setLoading(true);
            await handleAddToCart();
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSuccess = async () => {
          console.log('Login success called, closing modal'); // Add this

        setShowLoginModal(false);
        try {
            setLoading(true);
            await handleAddToCart();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={`product-card ${isOnSale ? 'on-sale' : ''}`} onClick={handleClick} data-category={category}>
                {isOnSale && <div className="sale-badge">SALE</div>}
                <input type="hidden" name="" value={id} />
                <img src={imageURL} alt={name} />
                <p className="category">{category}</p>
                <h3>{name}</h3>
                <div className="price-container">
                    {isOnSale ? (
                        <>
                            <p className="original-price">${originalPrice}</p>
                            <p className="sale-price">${price}</p>
                        </>
                    ) : (
                        <p className="price">${price}</p>
                    )}
                </div>
                <p className="stars">
                    {'★'.repeat(rating) + '☆'.repeat(5 - rating)}
                </p>
                <button
                    className="add-to-cart-btn"
                    onClick={handleAddClick}
                    disabled={loading}
                    aria-busy={loading}
                >
                    {loading ? 'Adding...' : 'Add to Cart'}
                </button>
            </div>

            {/* Render modal using portal to document.body */}
            {showLoginModal && createPortal(
                <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
                    <Login onSuccess={handleLoginSuccess} />
                </Modal>,
                document.body
            )}
        </>
    );
}

export default DeviceCard;