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

// Define the shape of the shipping address
interface ShippingAddress {
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

// Define the shape of the context's value
interface CartContextType {
    cartItems: CartItem[];
    shippingAddress: ShippingAddress | null;
    addToCart: (product: Product, quantity: number) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (id: string) => void;
    saveShippingAddress: (address: ShippingAddress) => void;
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

    const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(() => {
        try {
            const localData = localStorage.getItem('shippingAddress');
            return localData ? JSON.parse(localData) : null;
        } catch (error) {
            return null;
        }
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        if (shippingAddress) {
            localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
        }
    }, [shippingAddress]);

    const addToCart = (product: Product, quantity: number) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id);
            if (existingItem) {
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
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

    const saveShippingAddress = (address: ShippingAddress) => {
        setShippingAddress(address);
    };

    return (
        <CartContext.Provider value={{ cartItems, shippingAddress, addToCart, updateQuantity, removeFromCart, saveShippingAddress }}>
            {children}
        </CartContext.Provider>
    );
};
