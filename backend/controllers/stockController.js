import Stock from '../models/Stock.js';

// Create a new stock item
export const createStock = async (req, res) => {
  try {
    const newStock = new Stock(req.body);
    const stock = await newStock.save();
    res.status(201).json({ message: 'Stock item added successfully', stock });
  } catch (error) {
    res.status(400).json({ message: 'Error creating stock item', error });
  }
};

// Get all stock items
export const getStockItems = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock items', error });
  }
};

// Get a single stock item by ID
export const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock item', error });
  }
};

// Update a stock item by ID
export const updateStock = async (req, res) => {
  try {
    const updatedStock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }
    res.status(200).json({ message: 'Stock item updated successfully', stock: updatedStock });
  } catch (error) {
    res.status(400).json({ message: 'Error updating stock item', error });
  }
};

// Delete a stock item by ID
export const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }
    res.status(200).json({ message: 'Stock item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting stock item', error });
  }
};
