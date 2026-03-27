const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// Get all food items
router.get('/', async (req, res) => {
    try {
        const food = await Food.find();
        res.json(food);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get food items by category (Hosteler/Day Scholar)
router.get('/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const food = await Food.find({ $or: [{ category }, { category: 'Both' }] });
        res.json(food);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin routes (should ideally have auth middleware)
// Add food
router.post('/add', async (req, res) => {
    try {
        const { name, description, price, category, dietaryType, imageUrl } = req.body;
        const newFood = new Food({ name, description, price, category, dietaryType, imageUrl });
        await newFood.save();
        res.status(201).json(newFood);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit food
router.put('/edit/:id', async (req, res) => {
    try {
        const { name, description, price, category, dietaryType, imageUrl, isAvailable } = req.body;
        const updatedFood = await Food.findByIdAndUpdate(req.params.id, { name, description, price, category, dietaryType, imageUrl, isAvailable }, { new: true });
        res.json(updatedFood);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete food
router.delete('/delete/:id', async (req, res) => {
    try {
        await Food.findByIdAndDelete(req.params.id);
        res.json({ message: 'Food item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
