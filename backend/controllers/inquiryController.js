import Inquiry from '../models/Inquiry.js';

// Create a new inquiry
export const createInquiry = async (req, res) => {
  try {
    const { name, email, contact, inquiryMessage } = req.body;
    
    const newInquiry = new Inquiry({
      name,
      email,
      contact,
      inquiryMessage,
    });

    const inquiry = await newInquiry.save();


    res.status(201).json({ message: 'Inquiry created and emailed successfully', inquiry });
  } catch (error) {
    res.status(500).json({ message: 'Error creating inquiry', error: error.message });
  }
};

// Get all inquiries
// Get all inquiries (sorted by latest first)
export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }); 
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiries', error: error.message });
  }
};
  
// Get a single inquiry by ID
export const getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.status(200).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiry', error: error.message });
  }
};

// Update an inquiry by ID
export const updateInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.status(200).json(inquiry);
  } catch (error) {
    res.status(400).json({ message: 'Error updating inquiry', error: error.message });
  }
};

// Delete an inquiry by ID
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.status(200).json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inquiry', error: error.message });
  }
};
