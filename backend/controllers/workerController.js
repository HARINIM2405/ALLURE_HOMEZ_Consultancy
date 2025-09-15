// workerController.js
import Worker from '../models/Worker.js';

// Create a new worker
export const createWorker = async (req, res) => {
  try {
    const { name, position, department, email, phone, status, hireDate } = req.body;
    const newWorker = new Worker({ name, position, department, email, phone, status, hireDate });
    await newWorker.save();
    res.status(201).json({ message: 'Worker added successfully', worker: newWorker });
  } catch (error) {
    res.status(500).json({ message: 'Error adding worker', error: error.message });
  }
};

// Get all workers
export const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find();
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workers', error: error.message });
  }
};

// Get a worker by ID
export const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.status(200).json(worker);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching worker', error: error.message });
  }
};

// Update a worker by ID
export const updateWorker = async (req, res) => {
  try {
    const updatedWorker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedWorker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.status(200).json({ message: 'Worker updated successfully', worker: updatedWorker });
  } catch (error) {
    res.status(500).json({ message: 'Error updating worker', error: error.message });
  }
};

// Delete a worker by ID
export const deleteWorker = async (req, res) => {
  try {
    const deletedWorker = await Worker.findByIdAndDelete(req.params.id);
    if (!deletedWorker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.status(200).json({ message: 'Worker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting worker', error: error.message });
  }
};
