import React, { useState, useEffect, useContext } from "react";
import "../componentStyle/ProductReview.css";
import { getData, postData } from "./ApiService";
import { useLoader } from "../assets/LoaderContext";
import { AuthContext } from "../assets/AuthContext";
import Modal from "./modal";
import { showSuccessToast, showErrorToast, showWarningToast } from "../utils/toast";

const ProductReviews = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [allOrderItems, setAllOrderItems] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewDescription, setReviewDescription] = useState("");
  const { showLoader, hideLoader } = useLoader();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrderItems();
      fetchReviewsHistory();
    }
  }, [isLoggedIn]);

  const fetchOrderItems = async () => {
    try {
      showLoader();
      const response = await getData("GetReviewOrderItems");
      const data = response.data;
      if (data && Array.isArray(data)) {
        setAllOrderItems(data);
      } else {
        console.error("Data is not an array:", data);
        setAllOrderItems([]);
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
      setAllOrderItems([]);
    } finally {
      hideLoader();
    }
  };
  const fetchReviewsHistory = async () => {
    try {
      showLoader();
      const response = await getData("GetReviews");
        setAllReviews(response.data || []);
    } catch (error) {
      console.error("Error fetching reviews history:", error);
      setAllReviews([]);
    } finally {
      hideLoader();
    }
  };

  // Filter data by selected year on frontend
  const orderItems = allOrderItems.filter((item) => {
    // Assuming items have a date field - adjust field name if different
    const itemYear = new Date(item.orderDate || item.date).getFullYear().toString();
    return itemYear === selectedYear;
  });

  const reviewsHistory = allReviews.filter((review) => {
    const reviewYear = new Date(review.reviewDate).getFullYear().toString();
    return reviewYear === selectedYear;
  });

  const handleWriteReview = (item) => {
    setSelectedProduct(item);
    setReviewStars(0);
    setReviewDescription("");
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (reviewStars === 0) {
      showWarningToast("Please select a star rating");
      return;
    }
    if (!reviewDescription.trim()) {
      showWarningToast("Please write a review description");
      return;
    }

    try {
      showLoader();
      const review = {
        reviewID: selectedProduct.cartItemID,
        reviewstars: reviewStars,
        reviewDescription: reviewDescription
      };

      await postData("WriteReview", review);
      showSuccessToast("Review submitted successfully!");
      setIsReviewModalOpen(false);
      fetchOrderItems();
      fetchReviewsHistory();
    } catch (error) {
      console.error("Error submitting review:", error);
      showErrorToast("Failed to submit review. Please try again.");
    } finally {
      hideLoader();
    }
  };

  const handleUpdateReview = (review) => {
    setSelectedReview(review);
    setReviewStars(review.reviewstars);
    setReviewDescription(review.reviewDescription);
    setIsUpdateModalOpen(true);
  };

  const handleSubmitUpdate = async () => {
    if (reviewStars === 0) {
      showWarningToast("Please select a star rating");
      return;
    }
    if (!reviewDescription.trim()) {
      showWarningToast("Please write a review description");
      return;
    }

    try {
      showLoader();
      const updatedReview = {
        reviewID: selectedReview.reviewID,
        reviewstars: reviewStars,
        reviewDescription: reviewDescription
      };

      await postData("UpdateReview", updatedReview);
      showSuccessToast("Review updated successfully!");
      setIsUpdateModalOpen(false);
      fetchReviewsHistory();
    } catch (error) {
      console.error("Error updating review:", error);
      showErrorToast("Failed to update review. Please try again.");
    } finally {
      hideLoader();
    }
  };

  const handleDeleteReview = (review) => {
    setSelectedReview(review);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteReview = async () => {
    try {
      showLoader();
      await postData(`RemoveReview/${selectedReview.reviewID}`);
      showSuccessToast("Review deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchReviewsHistory();
    } catch (error) {
      console.error("Error deleting review:", error);
      showErrorToast("Failed to delete review. Please try again.");
    } finally {
      hideLoader();
    }
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? "filled" : ""} ${interactive ? "interactive" : ""}`}
            onClick={interactive ? () => onRate(star) : undefined}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };
  console.log(reviewsHistory)
  return (
    <div className="invoice-section">
      <div className="header">
        <h2>Product Reviews</h2>
        <div className="dropdown">
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="tabs">
        <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
          Order Items
        </button>
        <button className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>
          Reviews History
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "orders" ? (
          <>
            {orderItems.length > 0 ? (
              orderItems.map((item) => (
                <div className="review-item" key={item.cartItemID}>
                  <img src={item.productImage} alt={item.productName} />
                  <div className="info">
                    <p>{item.productName}</p>
                  </div>
                  <button className="review-btn" onClick={() => handleWriteReview(item)}>
                    Write Review
                  </button>
                </div>
              ))
            ) : (
              <p>No order items available for review.</p>
            )}
          </>
        ) : (
          <>
            {reviewsHistory.length > 0 ? (
              reviewsHistory.map((review) => (
                <div className="review-history-item" key={review.reviewID}>
                  <img src={review.productImage} alt={review.productName} />
                  <div className="review-details">
                    <h3>{review.productName}</h3>
                    {renderStars(review.reviewstars)}
                    <p className="review-date">{formatDate(review.reviewDate)}</p>
                    <p className="review-text">{review.reviewDescription}</p>
                  </div>
                  <div className="review-actions">
                    <button className="update-review-btn" onClick={() => handleUpdateReview(review)}>
                      <span className="btn-icon">✏️</span> Update
                    </button>
                    <button className="delete-review-btn" onClick={() => handleDeleteReview(review)}>
                      <span className="btn-icon">🗑️</span> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No review history available.</p>
            )}
          </>
        )}
      </div>

      {/* Review Modal */}
      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)}>
        <div className="review-modal">
          <h2>Write a Review</h2>
          {selectedProduct && (
            <div className="product-info-modal">
              <img src={selectedProduct.productImage} alt={selectedProduct.productName} />
              <p>{selectedProduct.productName}</p>
            </div>
          )}
          <div className="rating-section">
            <label>Your Rating:</label>
            {renderStars(reviewStars, true, setReviewStars)}
          </div>
          <div className="description-section">
            <label>Your Review:</label>
            <textarea
              value={reviewDescription}
              onChange={(e) => setReviewDescription(e.target.value)}
              placeholder="Share your experience with this product..."
              rows="5"
            />
          </div>
          <div className="modal-actions">
            <button className="cancel-btn" onClick={() => setIsReviewModalOpen(false)}>
              Cancel
            </button>
            <button className="submit-btn" onClick={handleSubmitReview}>
              Submit Review
            </button>
          </div>
        </div>
      </Modal>

      {/* Update Review Modal */}
      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
        <div className="review-modal">
          <h2>Update Review</h2>
          {selectedReview && (
            <div className="product-info-modal">
              <img src={selectedReview.productImage} alt={selectedReview.productName} />
              <p>{selectedReview.productName}</p>
            </div>
          )}
          <div className="rating-section">
            <label>Your Rating:</label>
            {renderStars(reviewStars, true, setReviewStars)}
          </div>
          <div className="description-section">
            <label>Your Review:</label>
            <textarea
              value={reviewDescription}
              onChange={(e) => setReviewDescription(e.target.value)}
              placeholder="Share your experience with this product..."
              rows="5"
            />
          </div>
          <div className="modal-actions">
            <button className="cancel-btn" onClick={() => setIsUpdateModalOpen(false)}>
              Cancel
            </button>
            <button className="submit-btn" onClick={handleSubmitUpdate}>
              Update Review
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="delete-confirmation-modal">
          <h2>Delete Review</h2>
          <p>Are you sure you want to delete this review? This action cannot be undone.</p>
          {selectedReview && (
            <div className="product-info-modal">
              <img src={selectedReview.productImage} alt={selectedReview.productName} />
              <p>{selectedReview.productName}</p>
            </div>
          )}
          <div className="modal-actions">
            <button className="cancel-btn" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </button>
            <button className="delete-confirm-btn" onClick={confirmDeleteReview}>
              Delete Review
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductReviews;
