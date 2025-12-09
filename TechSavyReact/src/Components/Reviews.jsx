import React, { useState } from "react";
import "../componentStyle/ProductReview.css"; // You'll create this for styles

const ProductReviews = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedYear, setSelectedYear] = useState("2024");

  const orderItems = [
    {
      name: "Dell 65W 19.5V 3.34A Black Small Pin Laptop Charger",
      image: "https://picsum.photos/200?random=1",
    },
    {
      name: "Generic charger for Dell 19.5V - 4.62A",
      image: "https://picsum.photos/200?random=2",
    },
  ];

  return (
    <div className="invoice-section">
      <div className="header">
        <h2>Product Reviews</h2>
        <div className="dropdown">
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
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
            {orderItems.map((item, index) => (
              <div className="review-item" key={index}>
                <img src={item.image} alt={item.name} />
                <div className="info">
                  <p>{item.name}</p>
                </div>
                <button className="review-btn">Write Review</button>
              </div>
            ))}
          </>
        ) : (
          <p>No review history available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
