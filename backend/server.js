import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';                    // <-- import cors
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import clientRoutes from './routes/clientRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';

import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

connectDB();

// Enable CORS globally (adjust origin to your frontend URL)
app.use(cors({
  origin: 'http://localhost:5173',    // change if your frontend runs elsewhere
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/api/orders', orderRoutes);

// API routes
app.use('/api/admin', adminRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
