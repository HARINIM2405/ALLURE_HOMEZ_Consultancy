import Client from '../models/Client.js';
import Worker from '../models/Worker.js';
import Stock from '../models/Stock.js';
import Inquiry from '../models/Inquiry.js';

export const getSummary = async (req, res) => {
  try {
    const totalClients = await Client.countDocuments();
    const activeWorkers = await Worker.countDocuments();
    const totalStockItems = await Stock.countDocuments();

    // Aggregate inquiries by normalized status (case-insensitive, default to 'in progress')
    const enquiryStatusCounts = await Inquiry.aggregate([
      {
        $group: {
          _id: {
            $cond: [
              { $ifNull: ['$status', false] },
              { $toLower: '$status' },
              'in progress'
            ]
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const enquiryStatus = enquiryStatusCounts.map((item) => ({
      status: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      count: item.count,
    }));

    const pendingEnquiries =
      enquiryStatus.find((e) => e.status.toLowerCase() === 'in progress')?.count || 0;

    res.json({
      totalClients,
      activeWorkers,
      totalStockItems,
      pendingEnquiries,
      enquiryStatus,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch summary', error: err.message });
  }
};
