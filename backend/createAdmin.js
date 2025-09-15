import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import connectDB from './config/db.js';

dotenv.config();
await connectDB();

const createAdmin = async () => {
  const exists = await Admin.findOne({ username: 'admin' });
  if (exists) {
    console.log('Admin already exists');
    process.exit();
  }

  const admin = new Admin({
    username: 'admin',
    password: 'admin123'
  });

  await admin.save();
  console.log('✅ Admin created');
  process.exit();
};

createAdmin();
