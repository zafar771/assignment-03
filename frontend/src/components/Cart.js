import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Cart = () => {
    const { cart, totalPrice, updateQuantity, removeFromCart } = useContext(CartContext);

    return (
        <div>
            <h2>Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    <ul>
                        {cart.map((item) => (
                            <li key={item.productId._id}>
                                <h3>{item.productId.name}</h3>
                                <p>Price: ${item.productId.price}</p>
                                <p>Quantity: {item.quantity}</p>
                                <button onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}>
                                    +
                                </button>
                                <button onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}>
                                    -
                                </button>
                                <button onClick={() => removeFromCart(item.productId._id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <h3>Total Price: ${totalPrice}</h3>
                </div>
            )}
        </div>
    );
};

export default Cart;
