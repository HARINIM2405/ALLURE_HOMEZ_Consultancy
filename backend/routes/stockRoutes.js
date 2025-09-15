import express from 'express';
import Stock from '../models/Stock.js';

const router = express.Router();

// Create a new stock item
router.post('/add', async (req, res) => {
  try {
    const { name, category, quantity, price, supplier, status, lastUpdated } = req.body;
    const newStock = new Stock({ name, category, quantity, price, supplier, status, lastUpdated });
    await newStock.save();
    res.status(201).json({ message: 'Stock item added successfully', stock: newStock });
  } catch (error) {
    res.status(500).json({ message: 'Error adding stock item', error: error.message });
  }
});

// Get all stock items
router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock items', error: error.message });
  }
});

// Get a stock item by ID
router.get('/:id', async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock item', error: error.message });
  }
});

// Update a stock item by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedStock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }
    res.status(200).json({ message: 'Stock item updated successfully', stock: updatedStock });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock item', error: error.message });
  }
});

// Delete a stock item by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedStock = await Stock.findByIdAndDelete(req.params.id);
    if (!deletedStock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }
    res.status(200).json({ message: 'Stock item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting stock item', error: error.message });
  }
});

export default router;
