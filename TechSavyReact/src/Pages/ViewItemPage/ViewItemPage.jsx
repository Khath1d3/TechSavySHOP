import React,{useState,useEffect} from "react";
import Header2 from "../../Components/Header2";
import Footer from "../../Components/Footer";
import Modal from "../../Components/modal";
import { useParams } from "react-router-dom";
import "./ViewItemStyle.css";
import DeviceCard from "../../Components/DeviceCard";
import {useLoader} from "../../assets/LoaderContext";
import { useCart } from "../../assets/CartContext";
import { getData, postData } from "../../Components/ApiService";


function ViewItemPage() {

      const [product, setProduct] = useState([]);
      const [related, setRelated] = useState([]);
      const { showLoader, hideLoader } = useLoader();
      const { updateCartCount } = useCart();
      const { id } = useParams(); // product ID from the route
      const [message, setMessage] = useState("");
      const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
      const [selectedStarFilter, setSelectedStarFilter] = useState(0);
      const [isInCart, setIsInCart] = useState(false);
      
      const dummyReviews = [
          { id: 1, user: "John Doe", rating: 5, comment: "Excellent product! Highly recommend.", date: "2025-01-15" },
          { id: 2, user: "Jane Smith", rating: 4, comment: "Good quality, fast shipping.", date: "2025-01-10" },
          { id: 3, user: "Mike Johnson", rating: 3, comment: "Average product, could be better.", date: "2025-01-05" },
          { id: 4, user: "Sarah Williams", rating: 5, comment: "Perfect! Exactly what I needed.", date: "2024-12-28" },
          { id: 5, user: "Tom Brown", rating: 2, comment: "Not as described, disappointed.", date: "2024-12-20" },
          { id: 6, user: "Emily Davis", rating: 4, comment: "Great value for money.", date: "2024-12-15" },
          { id: 7, user: "Chris Wilson", rating: 1, comment: "Poor quality, would not buy again.", date: "2024-12-10" },
          { id: 8, user: "Lisa Anderson", rating: 5, comment: "Amazing! Best purchase ever.", date: "2024-12-05" }
      ];

      const filteredReviews = selectedStarFilter === 0 
          ? dummyReviews 
          : dummyReviews.filter(review => review.rating === selectedStarFilter);

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
  const checkCart = async () => {
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
}, [id]);

const handleAddToCart = async () => {
  try {
    showLoader();
    await postData("AddToCart", parseInt(id));
    setIsInCart(true);
    updateCartCount(); // Update cart count after adding
  } catch (error) {
    console.error("Error adding to cart:", error);
    setMessage("Error adding to cart. Please try again later.");
  } finally {
    hideLoader();
  }
};

const handleRemoveFromCart = async () => {
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
            <Header2 />
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
                                <p>This is a detailed description of the product. It includes all the features, 
                                    specifications, and other relevant information that a customer would need to know before making a purchase.</p>
                                <button className="viewitem-view-reviews-btn" onClick={() => setIsReviewModalOpen(true)}>
                                    View Reviews ({dummyReviews.length})
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
                <h2>Customer Reviews</h2>
                
                <div className="viewitem-star-filter">
                    <button 
                        className={`viewitem-filter-btn ${selectedStarFilter === 0 ? 'active' : ''}`}
                        onClick={() => setSelectedStarFilter(0)}
                    >
                        All ({dummyReviews.length})
                    </button>
                    {[5, 4, 3, 2, 1].map(star => {
                        const count = dummyReviews.filter(r => r.rating === star).length;
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

                <div className="viewitem-reviews-list">
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map(review => (
                            <div key={review.id} className="viewitem-review-card">
                                <div className="viewitem-review-header">
                                    <div>
                                        <h4>{review.user}</h4>
                                        <p className="viewitem-review-date">{review.date}</p>
                                    </div>
                                    <div className="viewitem-review-rating">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </div>
                                </div>
                                <p className="viewitem-review-comment">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p className="viewitem-no-reviews">No reviews found for this rating.</p>
                    )}
                </div>
            </div>
        </Modal>

        <Footer />

        </>
    );
}
export default ViewItemPage;
