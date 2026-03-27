import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const auth = useContext(AuthContext) || {};
    const user = auth.user;
    const [cart, setCart] = useState([]);
    const [orderType, setOrderType] = useState('Normal'); // 'Normal' or 'Hostel'

    useEffect(() => {
        if (user && user.userType !== 'Hosteler') {
            setOrderType('Normal'); // Force Normal for non-hostelers
        }
    }, [user]);

    const addToCart = (food) => {
        const existingItem = cart.find(item => item._id === food._id);
        if (existingItem) {
            setCart(cart.map(item => item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...food, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item._id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return removeFromCart(id);
        setCart(cart.map(item => item._id === id ? { ...item, quantity } : item));
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    // Dynamic Charges
    const deliveryFee = (orderType === 'Hostel' && user && user.userType === 'Hosteler') ? 15 : 0;
    const totalBill = totalAmount + deliveryFee;

    return (
        <CartContext.Provider value={{ 
            cart, addToCart, removeFromCart, updateQuantity, clearCart, 
            totalAmount, cartCount, orderType, setOrderType,
            deliveryFee, totalBill
        }}>
            {children}
        </CartContext.Provider>
    );
};
