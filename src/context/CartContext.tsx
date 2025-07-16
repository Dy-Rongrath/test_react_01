import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Define the shape of a single cart item
interface CartItem {
    _id: string;
    name: string;
    imageUrl: string;
    price: number;
    stock: number;
    quantity: number;
}

// Define the shape of the context's value
interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (id: string) => void;
}

// Define the shape of a Product (matching ProductPage)
interface Product {
    _id: string;
    name: string;
    imageUrl: string;
    price: number;
    stock: number;
}


// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a custom hook for easy access to the context
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// Create the provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: Product, quantity: number) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id);
            if (existingItem) {
                // If item exists, update its quantity
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            // If item is new, add it to the cart
            return [...prevItems, { ...product, quantity: quantity }];
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === productId ? { ...item, quantity: quantity } : item
            )
        );
    };

    const removeFromCart = (id: string) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== id));
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};