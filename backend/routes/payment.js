const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay Order
router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency } = req.body;
        console.log('Received payment request:', req.body);
        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }
        console.log('Creating Razorpay order for amount:', amount);
        const options = {
            amount: Math.round(Number(amount) * 100), // amount in the smallest currency unit (paise)
            currency: currency || 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        console.log('Razorpay order created:', order.id);
        res.json(order);
    } catch (err) {
        console.error('Razorpay Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Verify Payment Signature
router.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ error: "Invalid signature sent!" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
