import express from 'express';
import Client from '../models/clientModel.js';
import Worker from '../models/workerModel.js';
import Stock from '../models/stockModel.js';
import Inquiry from '../models/inquiryModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const totalClients = await Client.countDocuments();
    const totalWorkers = await Worker.countDocuments();
    const totalStock = await Stock.countDocuments();
    const pendingInquiries = await Inquiry.countDocuments({ status: 'In Progress' });

    const clientGrowth = [
      { month: 'Jan', clients: 65 },
      { month: 'Feb', clients: 72 },
      { month: 'Mar', clients: 68 },
      { month: 'Apr', clients: 75 },
      { month: 'May', clients: 82 },
      { month: 'Jun', clients: 89 },
    ];

    const stockByCategory = [
      { category: 'Electronics', stock: 45 },
      { category: 'Office', stock: 28 },
      { category: 'Apparel', stock: 86 },
    ];

    const enquiryStatus = [
      { status: 'New', count: 30 },
      { status: 'In Progress', count: 15 },
      { status: 'Resolved', count: 58 },
    ];

    res.json({
      totalClients,
      totalWorkers,
      totalStock,
      pendingInquiries,
      clientGrowth,
      stockByCategory,
      enquiryStatus,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
