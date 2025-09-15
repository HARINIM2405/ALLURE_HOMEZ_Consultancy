import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  company: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  joinDate: { type: Date, default: Date.now },
});

const Client = mongoose.model('Client', clientSchema);

export default Client;

