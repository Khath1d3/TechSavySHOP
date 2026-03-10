import React, { createContext, useState, useContext, useEffect } from 'react';
import { getData, postData } from '../Components_test/ApiService';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

// LocalStorage helper functions
export const getGuestCart = () => {
    try {
        const cart = localStorage.getItem('guestCart');
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error reading guest cart:', error);
        return [];
    }
};

export const setGuestCart = (cart) => {
    try {
        localStorage.setItem('guestCart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving guest cart:', error);
    }
};

export const addToGuestCart = (productId, quantity = 1, productDetails = {}) => {
    const cart = getGuestCart();
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ 
            productId, 
            quantity,
            name: productDetails.name,
            price: productDetails.price,
            imageLink: productDetails.imageLink
        });
    }
    
    setGuestCart(cart);
    return cart;
};

export const removeFromGuestCart = (productId) => {
    const cart = getGuestCart();
    const updatedCart = cart.filter(item => item.productId !== productId);
    setGuestCart(updatedCart);
    return updatedCart;
};

export const clearGuestCart = () => {
    localStorage.removeItem('guestCart');
};

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const { isLoggedIn } = useContext(AuthContext);

    const getGuestCartCount = () => {
        const cart = getGuestCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const fetchCartCount = async () => {
        if (!isLoggedIn) {
            // Get count from localStorage
            const guestCount = getGuestCartCount();
            setCartCount(guestCount);
            return;
        }
            
        try {
            const response = await getData('GetCartItemCount');
            const count = response.data || response.count || 0;
            setCartCount(count > 0 ? count : 0);
        } catch (error) {
            console.error('Error fetching cart count:', error);
            setCartCount(0);
        }
    };

    const updateCartCount = () => {
        fetchCartCount();
    };

    const syncGuestCartToServer = async () => {
        if (!isLoggedIn) return;
        
        const guestCart = getGuestCart();
        if (guestCart.length === 0) return;
        
        try {
            // Add each item from guest cart to server
            for (const item of guestCart) {
                try {
                    // Add item with proper quantity
                    for (let i = 0; i < item.quantity; i++) {
                        await postData('AddToCart', item.productId);
                    }
                } catch (error) {
                    console.error(`Error syncing product ${item.productId}:`, error);
                }
            }
            
            // Clear guest cart after successful sync
            clearGuestCart();
            
            // Update cart count from server
            await fetchCartCount();
        } catch (error) {
            console.error('Error syncing guest cart:', error);
        }
    };

    useEffect(() => {
        const initializeCart = async () => {
            // If user just logged in and has guest cart items, sync them first
            if (isLoggedIn) {
                const guestCart = getGuestCart();
                if (guestCart.length > 0) {
                    await syncGuestCartToServer();
                    return; // syncGuestCartToServer already calls fetchCartCount
                }
            } else {
                // User logged out - clear any server cart data and check localStorage
                setCartCount(0); // Reset immediately
            }
            // Fetch the cart count normally
            fetchCartCount();
        };
        
        initializeCart();
    }, [isLoggedIn]);

    return (
        <CartContext.Provider value={{ 
            cartCount, 
            updateCartCount, 
            syncGuestCartToServer,
            getGuestCartCount 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};
