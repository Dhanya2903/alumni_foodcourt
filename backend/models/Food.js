const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, enum: ['Hosteler', 'Day Scholar', 'Both'], default: 'Both' },
    dietaryType: { type: String, enum: ['Veg', 'Non-Veg', 'Snacks', 'Dessert'], default: 'Veg' },
    imageUrl: { type: String },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
