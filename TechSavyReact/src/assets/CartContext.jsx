import React, { createContext, useState, useContext, useEffect } from 'react';
import { getData } from '../Components_test/ApiService';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const { isLoggedIn } = useContext(AuthContext);

    const fetchCartCount = async () => {
        if (!isLoggedIn) {
            setCartCount(0);
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

    useEffect(() => {
        fetchCartCount();
    }, [isLoggedIn]);

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount }}>
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
