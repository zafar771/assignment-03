
import React, { useEffect, useState } from "react";
import { api } from "../api"; // Ensure api is set up for axios
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");
                setProducts(response.data);
                setLoading(false); // Finished loading
            } catch (error) {
                setError("Failed to load products. Please try again later.");
                setLoading(false); // Finished loading with error
                console.error("Failed to fetch products", error);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <p>Loading products...</p>; // Show loading message
    }

    if (error) {
        return <p>{error}</p>; // Show error message
    }

    return (
        <div>
            <h2>Product List</h2>
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        <h3>{product.name}</h3>
                        <p>Price: ${product.price}</p>
                        <button onClick={() => addToCart(product._id)}>Add to Cart</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
