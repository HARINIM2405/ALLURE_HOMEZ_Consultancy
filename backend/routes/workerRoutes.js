import express from 'express';
const router = express.Router();
import * as workerController from '../controllers/workerController.js';  // Import controller functions

// Create a new worker
router.post('/add', workerController.createWorker);

// Get all workers
router.get('/', workerController.getWorkers);

// Get a worker by ID
router.get('/:id', workerController.getWorkerById);

// Update a worker by ID
router.put('/:id', workerController.updateWorker);

// Delete a worker by ID
router.delete('/:id', workerController.deleteWorker);

export default router;
