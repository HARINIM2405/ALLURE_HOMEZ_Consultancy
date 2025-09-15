import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    inquiryMessage: { type: String, required: true },
    status: {
      type: String,
      enum: ['In Progress', 'Resolved'],
      default: 'In Progress',
    },
  },
  { timestamps: true } // <-- This adds createdAt and updatedAt fields
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;
