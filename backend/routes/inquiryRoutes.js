// routes/inquiryRoutes.js
import express from 'express';
import Inquiry from '../models/Inquiry.js';

const router = express.Router();

// POST /api/inquiries/add - Create a new inquiry
router.post('/add', async (req, res) => {
  try {
    const { name, email, contact, inquiryMessage } = req.body;

    const newInquiry = new Inquiry({
      name,
      email,
      contact,
      inquiryMessage,
    });

    await newInquiry.save();
    res.status(201).json({ message: 'Inquiry created successfully', inquiry: newInquiry });
  } catch (error) {
    res.status(500).json({ message: 'Error creating inquiry', error: error.message });
  }
});

// GET /api/inquiries - Get all inquiries
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ inquiryDate: -1 }); // latest first
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiries', error: error.message });
  }
});

// GET /api/inquiries/:id - Get a single inquiry by ID
router.get('/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.status(200).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiry', error: error.message });
  }
});

// PUT /api/inquiries/:id - Update inquiry details
router.put('/:id', async (req, res) => {
  try {
    const updatedInquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedInquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.status(200).json({ message: 'Inquiry updated successfully', inquiry: updatedInquiry });
  } catch (error) {
    res.status(500).json({ message: 'Error updating inquiry', error: error.message });
  }
});

// PUT /api/inquiries/:id/status - Update only the status field
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;

  if (!['In Progress', 'Resolved'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    inquiry.status = status;
    await inquiry.save({ validateModifiedOnly: true }); // ✅ only validate the changed field

    res.status(200).json({ message: 'Inquiry status updated', inquiry });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
});

// DELETE /api/inquiries/:id - Delete an inquiry
router.delete('/:id', async (req, res) => {
  try {
    const deletedInquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!deletedInquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.status(200).json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inquiry', error: error.message });
  }
});

export default router;
