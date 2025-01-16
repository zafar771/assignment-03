import React, { createContext, useState, useEffect } from "react";
import { api } from "../api"; // Ensure that api is correctly set up for axios

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [products, setProducts] = useState([]); // State for products list

    useEffect(() => {
        fetchCart();
        fetchProducts(); // Fetch products when the component mounts
    }, []);

    // Fetch products from backend
    const fetchProducts = async () => {
        try {
            const response = await api.get("/products");
            setProducts(response.data); // Assuming response is an array of products
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    // Fetch cart data from backend
    const fetchCart = async () => {
        try {
            const response = await api.get("/cart", { params: { userId: "12345" } });
            setCart(response.data.cart);
            setTotalPrice(response.data.totalPrice);
        } catch (error) {
            console.error("Failed to fetch cart", error);
        }
    };

    // Add product to cart
    const addToCart = async (productId, quantity = 1) => {
        try {
            await api.post("/cart", { userId: "12345", productId, quantity });
            fetchCart();
        } catch (error) {
            console.error("Failed to add to cart", error);
        }
    };

    // Update product quantity in the cart
    const updateQuantity = async (productId, quantity) => {
        try {
            await api.put("/cart", { userId: "12345", productId, quantity });
            fetchCart();
        } catch (error) {
            console.error("Failed to update quantity", error);
        }
    };

    // Remove product from the cart
    const removeFromCart = async (productId) => {
        try {
            await api.delete("/cart", { data: { userId: "12345", productId } });
            fetchCart();
        } catch (error) {
            console.error("Failed to remove from cart", error);
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            totalPrice,
            products,  // Provide products to child components
            addToCart,
            updateQuantity,
            removeFromCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};
