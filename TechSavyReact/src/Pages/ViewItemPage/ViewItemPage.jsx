import React,{useState,useEffect,useContext} from "react";
import { createPortal } from "react-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Modal from "../../Components/modal";
import Login from "../../Components/login";
import { useParams } from "react-router-dom";
import "./ViewItemStyle.css";
import DeviceCard from "../../Components/DeviceCard";
import {useLoader} from "../../assets/LoaderContext";
import { useCart } from "../../assets/CartContext";
import { AuthContext } from "../../assets/AuthContext";
import { getData, postData } from "../../Components/ApiService";


function ViewItemPage() {

      const [product, setProduct] = useState([]);
      const [related, setRelated] = useState([]);
      const [productReviews, setProductReviews] = useState([]);
      const { showLoader, hideLoader } = useLoader();
      const { updateCartCount } = useCart();
      const { isLoggedIn } = useContext(AuthContext);
      const { id } = useParams(); // product ID from the route
      const [message, setMessage] = useState("");
      const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
      const [selectedStarFilter, setSelectedStarFilter] = useState(0);
      const [isInCart, setIsInCart] = useState(false);
      const [addedToCart, setAddedToCart] = useState(false);
      const [showLoginModal, setShowLoginModal] = useState(false);

      const filteredReviews = selectedStarFilter === 0 
          ? productReviews 
          : productReviews.filter(review => review.reviewStars === selectedStarFilter);

useEffect(() => {
  const fetchProduct = async () => {
    showLoader();
    try {
      const response = await getData(`GetProductsById/${id}?includeRelated=true`);
      console.log("response",response);
      if (response.success) {
        const data = await response.data;
        setProduct(data.product);
        setRelated(data.relatedProducts || []);
        
        // Save to recently viewed in localStorage
        try {
          const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
          const productId = parseInt(id);
          
          // Remove if already exists to avoid duplicates
          const filtered = recentlyViewed.filter(pId => pId !== productId);
          
          // Add to beginning and limit to 10 items
          const updated = [productId, ...filtered].slice(0, 10);
          
          localStorage.setItem('recentlyViewed', JSON.stringify(updated));
        } catch (storageError) {
          console.error("Error saving to recently viewed:", storageError);
        }
      } else {
        const err = await response.json();
        setMessage(`Error: ${err.message || "Failed to load product"}`);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setMessage("Error fetching product. Please try again later.");
    } finally {
      hideLoader();
    }
  };
  fetchProduct();
}, [id]);

useEffect(() => {
  const fetchProductReviews = async () => {
    try {
      const response = await getData(`GetProductReview/${id}`);
      if (response && response.data && Array.isArray(response.data)) {
        setProductReviews(response.data);
      } else {
        setProductReviews([]);
      }
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      setProductReviews([]);
    }
  };
  
  if (id) {
    fetchProductReviews();
  }
}, [id]);

useEffect(() => {
  const checkCart = async () => {
    if (!isLoggedIn) {
      setIsInCart(false);
      return;
    }
    
    try {
      const response = await getData("CustomerCart", { includeRelated: true });
      if (response.success) {
        const cartItems = response.data;
        const inCart = cartItems.some(item => item.ProductID === parseInt(id));
        setIsInCart(inCart);
      }
    } catch (error) {
      console.error("Error checking cart:", error);
    }
  };

  checkCart();
}, [id, isLoggedIn]);

const handleAddToCart = async () => {
  if (!isLoggedIn) {
    setShowLoginModal(true);
    return;
  }
  
  try {
    showLoader();
    await postData("AddToCart", parseInt(id));
    setIsInCart(true);
    updateCartCount(); // Update cart count after adding
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000); // Hide after 2 seconds
  } catch (error) {
    console.error("Error adding to cart:", error);
    setMessage("Error adding to cart. Please try again later.");
  } finally {
    hideLoader();
  }
};

const handleRemoveFromCart = async () => {
  if (!isLoggedIn) {
    setShowLoginModal(true);
    return;
  }
  
  try {
    showLoader();
    await postData("RemoveFromCart", parseInt(id));
    setIsInCart(false);
    updateCartCount(); // Update cart count after removing
  } catch (error) {
    console.error("Error removing from cart:", error);
    setMessage("Error removing from cart. Please try again later.");
  } finally {
    hideLoader();
  }
};

    return (
        <>
            <Header />
            <div className="viewitem-view-item-page">
                {product && product.productID ? (
                    <div className="view-item-container" key={product.id}>
                        <div className="img-container"><img src={product.imageLink} alt={product.name} /></div>
                       
                        <div className="view-item-description">
                            <h3>{product.name}</h3>
                            <p className="category">{product.category}</p>
                            <p className="stars">
                                {'★'.repeat(product.rating) + '☆'.repeat(5 - product.rating)}
                            </p>
                                <h3>Description</h3>
                                <p>{product.description}</p>
                                <button className="viewitem-view-reviews-btn" onClick={() => setIsReviewModalOpen(true)}>
                                    View Reviews ({productReviews.length})
                                </button>
                        </div>
                        <div className="view-item-price">
                            <h2>Price :{product.price}</h2>
                            <p className="shipping-time">Ships in 5 - 7 work days</p>
                            <p className="shipping-time">Shipping: Free</p>
                            <p className="shipping-time">Delivery: 5 - 7 work days</p>
                            <p className="price">{product.price}</p>
                            {isInCart ? (
                                <button className="viewitem-remove-from-cart-btn" onClick={handleRemoveFromCart}>
                                    Remove from Cart
                                </button>
                            ) : (
                                <button className="viewitem-add-to-cart-btn" onClick={handleAddToCart}>
                                    Add to Cart
                                </button>
                            )}
                            {addedToCart && (
                                <div className="add-to-cart-success">
                                    ✓ Added to cart!
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>Loading product...</p>
                )}
               
        </div>
        <div className="similar-products-container">
            <h1 className="similarHeader" >Similar Products</h1>
            <div className="similar-products">
            {related.length > 0 ? (
                related.map((item) => (
                <DeviceCard
                    key={item.productID}
                    id={item.productID}
                    name={item.name}
                    category={item.category}
                    price={item.price}
                    imageURL={item.imageLink}
                    rating={item.rating}
                />
                ))
            ) : (
                <p>No similar products found.</p>
            )}
            </div>

        </div>

        {/* Reviews Modal */}
        <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)}>
            <div className="viewitem-reviews-modal">
                <div className="modal-header-fixed">
                    <h2>Customer Reviews</h2>
                    
                    <div className="viewitem-star-filter">
                        <button 
                            className={`viewitem-filter-btn ${selectedStarFilter === 0 ? 'active' : ''}`}
                            onClick={() => setSelectedStarFilter(0)}
                        >
                            All ({productReviews.length})
                        </button>
                        {[5, 4, 3, 2, 1].map(star => {
                            const count = productReviews.filter(r => r.reviewStars === star).length;
                            return (
                                <button 
                                    key={star}
                                    className={`viewitem-filter-btn ${selectedStarFilter === star ? 'active' : ''}`}
                                    onClick={() => setSelectedStarFilter(star)}
                                >
                                    {'★'.repeat(star)}{'☆'.repeat(5 - star)} ({count})
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="modal-body-scrollable viewitem-reviews-list">
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map(review => (
                            <div key={review.reviewID} className="viewitem-review-card">
                                <div className="viewitem-review-header">
                                    <p className="viewitem-review-date">
                                        {new Date(review.reviewDate).toLocaleDateString("en-US", { 
                                            year: "numeric", 
                                            month: "long", 
                                            day: "numeric" 
                                        })}
                                    </p>
                                    <div className="viewitem-review-rating">
                                        {'★'.repeat(review.reviewStars)}{'☆'.repeat(5 - review.reviewStars)}
                                    </div>
                                </div>
                                <p className="viewitem-review-comment">{review.reviewDescription}</p>
                            </div>
                        ))
                    ) : (
                        <p className="viewitem-no-reviews">No reviews found for this rating.</p>
                    )}
                </div>
            </div>
        </Modal>

        {/* Login Modal Portal */}
        {showLoginModal && createPortal(
            <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
                <Login onSuccess={() => setShowLoginModal(false)} />
            </Modal>,
            document.body
        )}

        <Footer />

        </>
    );
}
export default ViewItemPage;
