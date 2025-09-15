import express from 'express';
import Client from '../models/Client.js';

const router = express.Router();

// Create a new client
router.post('/add', async (req, res) => {
  try {
    const { name, email, phone, company, status, joinDate } = req.body;
    const newClient = new Client({ name, email, phone, company, status, joinDate });
    await newClient.save();
    res.status(201).json({ message: 'Client added successfully', client: newClient });
  } catch (error) {
    res.status(500).json({ message: 'Error adding client', error: error.message });
  }
});

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
});

// Get a client by ID
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client', error: error.message });
  }
});

// Update a client by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json({ message: 'Client updated successfully', client: updatedClient });
  } catch (error) {
    res.status(500).json({ message: 'Error updating client', error: error.message });
  }
});

// Delete a client by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting client', error: error.message });
  }
});

export default router; // Updated export statement
