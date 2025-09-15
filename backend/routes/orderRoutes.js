import express from 'express';
import Order from '../models/orderModel.js';

const router = express.Router();

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  const {
    product,
    name,
    email,
    contact,
    location,
    address,
    orderInstructions,
    quantity,
  } = req.body;

  try {
    const order = new Order({
      product,
      name,
      email,
      contact,
      location,
      address,
      orderInstructions,
      quantity,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// ✅ ADD THIS: GET /api/orders - Fetch all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find(); // You can also `.populate('product')` if needed
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

export default router;
