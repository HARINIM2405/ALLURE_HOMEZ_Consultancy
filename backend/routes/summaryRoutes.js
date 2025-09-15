// routes/summaryRoutes.js
import express from 'express';
import { getSummary } from '../controllers/summaryController.js';

const router = express.Router();

// Route: GET /api/summary
router.get('/', getSummary);

export default router;
