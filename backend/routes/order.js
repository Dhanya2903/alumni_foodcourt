const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const crypto = require('crypto');

// Create a new order
router.post('/create', async (req, res) => {
    try {
        const { userId, items, totalAmount, paymentMethod, userType, hostelName, roomNumber } = req.body;
        
        // Generate Unique 6-digit Order Code
        const orderCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        // Calculate Charges
        let deliveryCharges = (userType === 'Hosteler' && hostelName) ? 15 : 0;
        let totalBill = totalAmount + deliveryCharges;

        const newOrder = new Order({ 
            userId, 
            orderCode,
            items, 
            totalAmount, 
            deliveryCharges,
            totalBill,
            paymentMethod, 
            userType, 
            hostelName,
            roomNumber,
            paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed' 
        });
        await newOrder.save();

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).populate('items.foodId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin - Get all orders
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find().populate('userId').populate('items.foodId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin - Update order status
router.put('/status/:id', async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
