const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://user1:123@cluster0.ec9tf.mongodb.net/add_view_cart', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Define Schema before using it
const CartSchema = new mongoose.Schema({
    userId: String,
    products: [{ productId: String, name: String, price: Number, quantity: Number }]
});


const Cart = mongoose.model('Cart', CartSchema);

// Add product to cart
app.post('/cart/add', async (req, res) => {
    const { userId, productId, name, price, quantity } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = new Cart({ userId, products: [] });
    }

    const existingProduct = cart.products.find(p => p.productId === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.products.push({ productId, name, price, quantity });
    }

    await cart.save();
    res.json({ message: 'Product added to cart', cart });
});

// Get cart details
app.get('/cart', async (req, res) => {
    const { userId } = req.query;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
        return res.json({ message: 'Cart is empty', products: [] });
    }
    res.json(cart);
});

app.listen(5000, () => {
    console.log('Cart microservice running on port 5000');
});
