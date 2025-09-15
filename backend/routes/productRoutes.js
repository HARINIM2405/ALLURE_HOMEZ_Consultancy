import express from 'express';
import { getAllProducts, addProduct, deleteProduct, updateProduct } from '../controllers/productController.js';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/', getAllProducts);          // GET all products
router.get('/:id', async (req, res) => {  // GET product by ID
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
router.post('/', addProduct);             // Add new product
router.put('/:id', updateProduct);        // <-- ADD this line for update
router.delete('/:id', deleteProduct);     // Delete product by ID

export default router;
