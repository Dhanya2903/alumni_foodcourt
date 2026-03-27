const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderCode: { type: String, unique: true, required: true },
    items: [{
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    deliveryCharges: { type: Number, default: 0 },
    totalBill: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    paymentMethod: { type: String, required: true },
    orderStatus: { type: String, enum: ['Ordered', 'Preparing', 'Packed', 'Ready', 'Delivered'], default: 'Ordered' },
    userType: { type: String, enum: ['Hosteler', 'Day Scholar'], required: true },
    hostelName: { type: String },
    roomNumber: { type: String }
}, { timestamps: true });

if (mongoose.models.Order) {
    delete mongoose.models.Order;
}

module.exports = mongoose.model('Order', orderSchema);
