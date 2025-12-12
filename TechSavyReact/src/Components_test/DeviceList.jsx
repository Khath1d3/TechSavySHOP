import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilter, FaTimes } from "react-icons/fa";
import DeviceCard from "./DeviceCard";
import "../componentStyle/DeviceListstyle.css"; // Import your CSS file for styling
import {useLoader} from "../assets/LoaderContext";
import { AuthContext } from "../assets/AuthContext";
import { useCart } from "../assets/CartContext";
import {getData,postData} from "./ApiService";

function DeviceList() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const { cartCount } = useCart();

  const [devices, setDevices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("default");
  const { showLoader, hideLoader } = useLoader();
  const [message, setMessage] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);


  const itemsPerPage = 9;

useEffect(() => {
  const GetProduct = async () => {
    try {
      showLoader();
      const data = await getData("Products");
      const products = data.data;
      setDevices(products);

      // Get recently viewed from localStorage
      try {
        const recentIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const recentProducts = recentIds
          .map(id => products.find(p => p.productID === id))
          .filter(p => p !== undefined)
          .slice(0, 3);
        setRecentlyViewedProducts(recentProducts);
      } catch (error) {
        console.error("Error loading recently viewed:", error);
      }

    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Error fetching products. Please try again later.");
    } finally {
      hideLoader();
    }
  };

  const GetCart = async () => {
    try {
      if (isLoggedIn) {
        const cartData = await getData("CustomerCart", { includeRelated: true });
        if (cartData.data.success) {
          setCartItems(cartData.data || []);
        }
        else {
          setCartItems([]);
        }
      }
    } catch (error) {
      // Cart is empty or not found - this is fine, just set empty array
      if (error.message && error.message.includes("Cart is empty")) {
        setCartItems([]);
      } else {
        console.error("Error fetching cart:", error);
      }
    }
  };

  GetProduct();
  GetCart();
}, []);

// Re-fetch cart when cartCount changes (when items are added/removed)
useEffect(() => {
  const GetCart = async () => {
    try {
      if (isLoggedIn) {
        const cartData = await getData("CustomerCart", { includeRelated: true });
        if (cartData.success) {
          setCartItems(cartData.data || []);
        }
      }
    } catch (error) {
      // Cart is empty or not found - this is fine, just set empty array
      if (error.message && error.message.includes("Cart is empty")) {
        setCartItems([]);
      } else {
        console.error("Error fetching cart:", error);
      }
    }
  };

  if (isLoggedIn) {
    GetCart();
  }
}, [cartCount, isLoggedIn]);

  const indexOfLastDevice = currentPage * itemsPerPage;
  const indexOfFirstDevice = indexOfLastDevice - itemsPerPage;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 9999]);

  // Filter products based on the filters applied
const filteredDevices = devices.filter((device) => {
  const price = device.price;
  const matchesSearchQuery = device.name.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesCategory = selectedCategory ? device.category === selectedCategory : true;
  const matchesPriceRange = price >= priceRange[0] && price <= priceRange[1];

  return matchesSearchQuery && matchesCategory && matchesPriceRange;
});
  useEffect(() => {
  setCurrentPage(1);
}, [searchQuery, selectedCategory, priceRange]);

const sortedDevices = [...filteredDevices].sort((a, b) => {
  const priceA = a.price;
  const priceB = b.price;

  if (sortOption === "price-low") return priceA - priceB;
  if (sortOption === "price-high") return priceB - priceA;
  return 0; 
});

const currentDevices = sortedDevices.slice(indexOfFirstDevice, indexOfLastDevice);

  // Handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);

  // Get unique categories from devices
  const categories = Array.from(
    new Set(devices.map((device) => device.category).filter(Boolean))
  );
console.log(currentDevices,"currentDevices");
  return (
    <div className="shop-container">
        {/* Filter Button for Mobile */}
        <button className="product-filter-toggle-btn" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <FaFilter /> Filters
        </button>

        {/* Overlay for mobile filter */}
        {isFilterOpen && <div className="product-filter-overlay" onClick={() => setIsFilterOpen(false)}></div>}

        <div className="product-grid">
            <h1>Shop</h1>
            <div className="sorting">
                <div className="sort-by">
                    <label htmlFor="sort">Default sorting</label>
                    <select id="sort"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                          >

                        <option value="default">Default</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
                <div id="product-info">
            Showing {indexOfFirstDevice + 1}–{Math.min(indexOfLastDevice, filteredDevices.length)} of {filteredDevices.length} results
                 </div>
            </div>
        <div id="products" className="products">
            {currentDevices.length > 0 ? (
              currentDevices.map((device) => (
                <DeviceCard
                  key={device.productID}
                  id={device.productID}
                  name={device.name}
                  category={device.category}
                  price={device.price}
                  originalPrice={device.originalPrice}
                  isOnSale={device.isOnSale}
                  imageURL={device.imageLink}
                  rating={device.rating}
                />
              ))
            ) : (
              <p>No products available</p>
            )}
        </div>
       <div id="pagination" className="product-pagination">
  {/* Prev Button */}
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      if (currentPage > 1) paginate(currentPage - 1);
    }}
    className={`pagination-link ${currentPage === 1 ? "disabled" : ""}`}
  >
    Prev
  </a>

  {/* Current Page */}
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      paginate(currentPage);
    }}
    className="product-pagination-link active"
  >
    {currentPage}
  </a>

  {/* Next Page (if available) */}
  {currentPage + 1 <= totalPages && (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        paginate(currentPage + 1);
      }}
      className="product-pagination-link"
    >
      {currentPage + 1}
    </a>
  )}

  {/* Next Button */}
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      if (currentPage < totalPages) paginate(currentPage + 1);
    }}
    className={`pagination-link ${currentPage === totalPages ? "disabled" : ""}`}
  >
    Next
  </a>
</div>
     </div>

    <aside className={`product-filters ${isFilterOpen ? 'product-filter-open' : ''}`}>
                <div className="product-filter-header">
                    <h3>Filters</h3>
                    <button className="product-filter-close-btn" onClick={() => setIsFilterOpen(false)}>
                        <FaTimes />
                    </button>
                </div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search products..."
                        id="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="product-filter-category">
                    <h3>Product categories</h3>
                    <select onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="product-filter-price">
                    <h3>Filter by price</h3>
                    <input
                        type="range"
                        min="0"
                        max="9999"
                        step="50"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    />
                    <p>Max Price: ${priceRange[1]}</p>
                </div>
                <div className="cart-summary">
                    <h3>Cart</h3>
                    {cartItems.length > 0 ? (
                        <div className="cart-items">
                            {cartItems.slice(0, 3).map((item) => (
                                <div 
                                    key={item.ProductID} 
                                    className="cart-item-preview"
                                    onClick={() => navigate(`/viewitem/${item.ProductID}`)}
                                >
                                    <img src={item.ImageLink} alt={item.Name} />
                                    <div className="cart-item-info">
                                        <p className="cart-item-name">{item.Name}</p>
                                        <p className="cart-item-price">${item.Price.toFixed(2)} x {item.Quantity}</p>
                                    </div>
                                </div>
                            ))}
                            {cartItems.length > 3 && (
                                <p className="cart-more">+{cartItems.length - 3} more items</p>
                            )}
                        </div>
                    ) : (
                        <p>No products in the cart.</p>
                    )}
                </div>
                <div className="recently-viewed">
                    <h3>Recently Viewed Products</h3>
                    {recentlyViewedProducts.length > 0 ? (
                        <div className="recent-products">
                            {recentlyViewedProducts.map((product) => (
                                <div 
                                    key={product.productID} 
                                    className="recent-product"
                                    onClick={() => navigate(`/viewitem/${product.productID}`)}
                                >
                                    <img src={product.imageLink} alt={product.name} />
                                    <div className="recent-product-info">
                                        <p className="recent-product-name">{product.name}</p>
                                        <p className="recent-product-price">${product.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No recently viewed products.</p>
                    )}
                </div>
            </aside>
    </div>
  );
}

export default DeviceList;

