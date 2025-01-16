const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Product = require("./models/Products");
const Cart = require("./models/Cart");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb+srv://abikhan367:<YJ4cdjrFsrVgnNz6>@cartsystem.np1tu.mongodb.net/?retryWrites=true&w=majority&appName=cartSystem", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// API Endpoints
// GET /products
app.get("/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// POST /cart
app.post("/cart", async (req, res) => {
    const { userId, productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (cart) {
        const item = cart.products.find((p) => p.productId.toString() === productId);
        if (item) {
            item.quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }
        await cart.save();
    } else {
        await Cart.create({ userId, products: [{ productId, quantity }] });
    }
    res.status(201).json({ message: "Product added to cart" });
});

// PUT /cart
app.put("/cart", async (req, res) => {
    const { userId, productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.products.find((p) => p.productId.toString() === productId);
    if (item) {
        item.quantity = quantity;
        await cart.save();
        res.json({ message: "Quantity updated" });
    } else {
        res.status(404).json({ error: "Product not found in cart" });
    }
});

// DELETE /cart
app.delete("/cart", async (req, res) => {
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = cart.products.filter((p) => p.productId.toString() !== productId);
    await cart.save();
    res.json({ message: "Product removed from cart" });
});

// GET /cart
app.get("/cart", async (req, res) => {
    const { userId } = req.query;
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const totalPrice = cart.products.reduce(
        (total, p) => total + p.productId.price * p.quantity,
        0
    );
    res.json({ cart: cart.products, totalPrice });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
