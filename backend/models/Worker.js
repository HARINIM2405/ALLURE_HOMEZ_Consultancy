import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  hireDate: { type: Date, default: Date.now },
});

const Worker = mongoose.model('Worker', workerSchema);

export default Worker;
