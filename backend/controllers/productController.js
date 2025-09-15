// controllers/productController.js
import Product from '../models/Product.js';

// GET all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// POST add a new product
export const addProduct = async (req, res) => {
  try {
    const { name, category, details, price, image } = req.body;

    const newProduct = new Product({
      name,
      category,
      details,
      price,
      image,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
};
// PUT update a product by id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, details, price, image } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, category, details, price, image },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};


// DELETE a product by id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
