import express from 'express';
import { getPortfolio, upsertPortfolio } from '../controllers/portfolioController.js';
import upload from '../middleware/uploadMiddleware.js'; // for image handling

const router = express.Router();

// GET portfolio content
router.get('/', getPortfolio);

// PUT to upsert portfolio content (including optional image uploads)
router.put(
  '/',
  upload.fields([
    { name: 'curtainsImages', maxCount: 10 },
    { name: 'cushionsImages', maxCount: 10 },
    { name: 'beddingImages', maxCount: 10 },
    { name: 'kitchenImages', maxCount: 10 }
  ]),
  upsertPortfolio
);

// POST route to upload a single image (used independently if needed)
router.post(
  '/upload-image',
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    const imageUrl = `/uploads/portfolio/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  }
);

export default router;
