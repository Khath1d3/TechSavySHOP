import React, { useEffect, useState } from "react";
import DeviceCard from "./DeviceCard";
import { getData } from "./ApiService";
import { useLoader } from "../assets/LoaderContext";

function MainSection() {
    const { showLoader, hideLoader } = useLoader();
    const [devices, setDevices] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [topRatedProducts, setTopRatedProducts] = useState([]);
    const [saleProducts, setSaleProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('recent');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const cardsPerPage = 4;

    // Get random products from array
    const getRandomProducts = (products, count = 3) => {
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    // Get recently viewed products from localStorage
    const getRecentlyViewed = () => {
        try {
            const recent = localStorage.getItem('recentlyViewed');
            return recent ? JSON.parse(recent) : [];
        } catch (error) {
            console.error("Error reading recently viewed:", error);
            return [];
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                showLoader();
                
                // Fetch products on sale for carousel only
                const saleData = await getData("ProductsOnSale");
                const onSaleProducts = saleData.data || [];
                setDevices(onSaleProducts);

                // Fetch all products for the category tabs
                const allData = await getData("Products");
                const products = allData.data || [];
                setAllProducts(products);

                // Get recently viewed from localStorage
                const recentIds = getRecentlyViewed();
                console.log("Recent IDs from localStorage:", recentIds);
                
                if (recentIds.length > 0) {
                    // Filter products that match recently viewed IDs and maintain order
                    const recentItems = recentIds
                        .map(id => products.find(p => p.productID === id))
                        .filter(p => p !== undefined)
                        .slice(0, 3);
                    
                    console.log("Recent products:", recentItems);
                    setRecentProducts(recentItems.length > 0 ? recentItems : getRandomProducts(products, 4));
                } else {
                    // If no recent views, use random products
                    setRecentProducts(getRandomProducts(products, 4));
                }

                // Set random products for Featured and Top Rated
                setFeaturedProducts(getRandomProducts(products, 4));
                setTopRatedProducts(getRandomProducts(products, 4));

                // Set sale products for the Sale tab
                setSaleProducts(getRandomProducts(onSaleProducts, 4));

            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                hideLoader();
            }
        };

        fetchProducts();
        
        // Add event listener to refetch when window gains focus (user returns to page)
        const handleFocus = () => {
            fetchProducts();
        };
        
        window.addEventListener('focus', handleFocus);
        
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    const goToPrevious = () => {
        if (isAnimating || currentIndex === 0) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prev) => Math.max(0, prev - cardsPerPage));
            setIsAnimating(false);
        }, 300);
    };

    const goToNext = () => {
        const maxStartIndex = Math.max(0, devices.length - cardsPerPage);
        if (isAnimating || currentIndex >= maxStartIndex) return;
        setIsAnimating(true);
        setTimeout(() => {
            const nextIndex = currentIndex + cardsPerPage;
            setCurrentIndex((prev) => Math.min(nextIndex, maxStartIndex));
            setIsAnimating(false);
        }, 300);
    };

    const showPrevButton = currentIndex > 0;
    const maxStartIndex = Math.max(0, devices.length - cardsPerPage);
    const showNextButton = currentIndex < maxStartIndex;

    return (
        <>
            <main className="landing-main">
                <section className="landing-hero">
                    <div className="landing-side-details">
                        <h1>New Collection Coming to Town</h1>
                        <p>Introducing fashionable & gorgeous iMac: From design to simple use</p>
                    </div>
                </section>

                <section className="landing-reliability">
                    <div className="landing-feature">
                        <h3>Home Shipping</h3>
                        <p>Free for all orders</p>
                    </div>
                    <div className="landing-feature">
                        <h3>100% Refund</h3>
                        <p>Cash back guarantee</p>
                    </div>
                    <div className="landing-feature">
                        <h3>Client Support</h3>
                        <p>Service anytime</p>
                    </div>
                    <div className="landing-feature">
                        <h3>Fast Delivery</h3>
                        <p>Best service</p>
                    </div>
                </section>

                <section className="landing-onsale">
                    <div className="landing-carousel-container">
                        {devices.length === 0 ? (
                            <div className="landing-no-products-message">
                                <p>No products available</p>
                            </div>
                        ) : (
                            <>
                                <button 
                                    className="landing-carousel-btn landing-prev-btn" 
                                    onClick={goToPrevious}
                                    disabled={!showPrevButton || isAnimating}
                                    aria-label="Previous Device"
                                >
                                    ←
                                </button>
                                
                                <div className="landing-cards-viewport">
                                    <div 
                                        className="landing-cards-container"
                                        style={{    
                                            transform: `translateX(-${currentIndex * (100 / cardsPerPage)}%)`,
                                        }}
                                    >
                                        {devices.map((device) => (
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
                                        ))}
                                    </div>
                                </div>
                                
                                <button 
                                    className="landing-carousel-btn landing-next-btn" 
                                    onClick={goToNext}
                                    disabled={!showNextButton || isAnimating}
                                    aria-label="Next Device"
                                >
                                    →
                                </button>
                            </>
                        )}
                    </div>
                </section>

                <section className="landing-product-categories">
                    <div className="landing-category-tabs">
                        <span 
                            className={`landing-category-tab ${activeCategory === 'recent' ? 'active' : ''}`}
                            onClick={() => handleCategoryClick('recent')}
                        >
                            Recent
                        </span>
                        <span 
                            className={`landing-category-tab ${activeCategory === 'featured' ? 'active' : ''}`}
                            onClick={() => handleCategoryClick('featured')}
                        >
                            Featured
                        </span>
                        <span 
                            className={`landing-category-tab ${activeCategory === 'toprated' ? 'active' : ''}`}
                            onClick={() => handleCategoryClick('toprated')}
                        >
                            Top Rated
                        </span>
                        <span 
                            className={`landing-category-tab ${activeCategory === 'sale' ? 'active' : ''}`}
                            onClick={() => handleCategoryClick('sale')}
                        >
                            Sale
                        </span>
                    </div>
                
                    <div className="landing-product-category-content">
                        <div id="recent" className={`landing-category-content ${activeCategory === 'recent' ? 'active' : ''}`}>
                            {recentProducts.length > 0 ? (
                                recentProducts.map((product) => (
                                    <DeviceCard
                                        key={product.productID}
                                        id={product.productID}
                                        name={product.name}
                                        category={product.category}
                                        price={product.price}
                                        originalPrice={product.originalPrice}
                                        isOnSale={product.isOnSale}
                                        imageURL={product.imageLink}
                                        rating={product.rating}
                                    />
                                ))
                            ) : (
                                <p className="landing-no-products">No recent products</p>
                            )}
                        </div>
                
                        <div id="featured" className={`landing-category-content ${activeCategory === 'featured' ? 'active' : ''}`}>
                            {featuredProducts.length > 0 ? (
                                featuredProducts.map((product) => (
                                    <DeviceCard
                                        key={product.productID}
                                        id={product.productID}
                                        name={product.name}
                                        category={product.category}
                                        price={product.price}
                                        originalPrice={product.originalPrice}
                                        isOnSale={product.isOnSale}
                                        imageURL={product.imageLink}
                                        rating={product.rating}
                                    />
                                ))
                            ) : (
                                <p className="landing-no-products">No featured products</p>
                            )}
                        </div>
                
                        <div id="toprated" className={`landing-category-content ${activeCategory === 'toprated' ? 'active' : ''}`}>
                            {topRatedProducts.length > 0 ? (
                                topRatedProducts.map((product) => (
                                    <DeviceCard
                                        key={product.productID}
                                        id={product.productID}
                                        name={product.name}
                                        category={product.category}
                                        price={product.price}
                                        originalPrice={product.originalPrice}
                                        isOnSale={product.isOnSale}
                                        imageURL={product.imageLink}
                                        rating={product.rating}
                                    />
                                ))
                            ) : (
                                <p className="landing-no-products">No top rated products</p>
                            )}
                        </div>
                
                        <div id="sale" className={`landing-category-content ${activeCategory === 'sale' ? 'active' : ''}`}>
                            {saleProducts.length > 0 ? (
                                saleProducts.map((product) => (
                                    <DeviceCard
                                        key={product.productID}
                                        id={product.productID}
                                        name={product.name}
                                        category={product.category}
                                        price={product.price}
                                        originalPrice={product.originalPrice}
                                        isOnSale={product.isOnSale}
                                        imageURL={product.imageLink}
                                        rating={product.rating}
                                    />
                                ))
                            ) : (
                                <p className="landing-no-products">No sale products</p>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
export default MainSection;