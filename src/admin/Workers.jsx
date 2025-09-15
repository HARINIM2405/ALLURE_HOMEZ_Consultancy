import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Workers.css';
import { IconButton, Tooltip } from '@mui/material';
import { Edit, Delete, PictureAsPdf } from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';  // Import the plugin properly

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [newWorker, setNewWorker] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await axios.get('/api/workers');
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
      setWorkers([]);
    }
  };

  const handleAddNew = () => {
    setNewWorker({
      name: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      status: 'Active',
      hireDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleSave = async () => {
    try {
      if (newWorker._id) {
        // Update existing worker
        const response = await axios.put(`/api/workers/${newWorker._id}`, newWorker);
        setWorkers(workers.map(w => (w._id === newWorker._id ? response.data.worker : w)));
      } else {
        // Create new worker
        const response = await axios.post('/api/workers/add', newWorker);
        setWorkers([...workers, response.data.worker]);
      }
      setNewWorker(null);
    } catch (error) {
      console.error('Error saving worker:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/workers/${id}`);
      setWorkers(workers.filter(worker => worker._id !== id));
    } catch (error) {
      console.error('Error deleting worker:', error);
    }
  };

  const handleEdit = (worker) => {
    setNewWorker(worker);
  };

  const handleChange = (e, field) => {
    setNewWorker({
      ...newWorker,
      [field]: e.target.value,
    });
  };

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Workers List', 14, 15);

    const tableColumn = ['Name', 'Position', 'Department', 'Email', 'Phone', 'Status', 'Hire Date'];
    const tableRows = [];

    filteredWorkers.forEach(worker => {
      const workerData = [
        worker.name,
        worker.position,
        worker.department,
        worker.email,
        worker.phone,
        worker.status,
        worker.hireDate ? new Date(worker.hireDate).toLocaleDateString() : '',
      ];
      tableRows.push(workerData);
    });

    // Use autoTable as a function, passing the doc as the first argument
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 136, 229] },
    });

    doc.save('workers-list.pdf');
  };

  return (
    <div className="workers-container">
      <div className="workers-header">
        <h2>Workers</h2>
        <p>Manage your worker information</p>
      </div>

      <div className="workers-controls">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name, position, department or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <button className="export-btn" onClick={exportPDF}>
            <PictureAsPdf fontSize="small" /> Export PDF
          </button>
          <button className="add-btn" onClick={handleAddNew}>+ Add New</button>
        </div>
      </div>

      <div className="workers-table-container">
        <table className="workers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Hire Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkers.map((worker) => (
              <tr key={worker._id}>
                <td>{worker.name}</td>
                <td>{worker.position}</td>
                <td>{worker.department}</td>
                <td>{worker.email}</td>
                <td>{worker.phone}</td>
                <td>
                  <span className={`status-badge ${worker.status.toLowerCase()}`}>
                    {worker.status}
                  </span>
                </td>
                <td>{worker.hireDate ? new Date(worker.hireDate).toLocaleDateString() : ''}</td>
                <td>
                  <Tooltip title="Edit" arrow>
                    <IconButton onClick={() => handleEdit(worker)} sx={{ color: '#0ea5e9' }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <IconButton onClick={() => handleDelete(worker._id)} sx={{ color: '#ef4444' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}

            {newWorker && (
              <tr>
                <td><input type="text" value={newWorker.name} onChange={(e) => handleChange(e, 'name')} /></td>
                <td><input type="text" value={newWorker.position} onChange={(e) => handleChange(e, 'position')} /></td>
                <td><input type="text" value={newWorker.department} onChange={(e) => handleChange(e, 'department')} /></td>
                <td><input type="email" value={newWorker.email} onChange={(e) => handleChange(e, 'email')} /></td>
                <td><input type="text" value={newWorker.phone} onChange={(e) => handleChange(e, 'phone')} /></td>
                <td>
                  <select value={newWorker.status} onChange={(e) => handleChange(e, 'status')}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td><input type="date" value={newWorker.hireDate} onChange={(e) => handleChange(e, 'hireDate')} /></td>
                <td><button onClick={handleSave}>Save</button></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Workers;
