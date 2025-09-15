import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  supplier: { type: String, required: true },
  status: { type: String, enum: ['Available', 'Out of Stock'], default: 'Available' },
  lastUpdated: { type: Date, default: Date.now },
});

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
