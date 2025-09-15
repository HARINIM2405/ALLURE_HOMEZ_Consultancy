import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Clients.css';
import { IconButton, Tooltip } from '@mui/material';
import { Edit, Delete, PictureAsPdf } from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get('/api/clients');
        setClients(res.data);
      } catch (err) {
        console.error("Error fetching clients", err);
        setClients([]);
      }
    };
    fetchClients();
  }, []);

  const handleAddClient = () => {
    setNewClient({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleSaveClient = async () => {
    try {
      if (newClient._id) {
        const res = await axios.put(`/api/clients/${newClient._id}`, newClient);
        setClients(prev =>
          prev.map(client => client._id === newClient._id ? res.data.client : client)
        );
      } else {
        const res = await axios.post('/api/clients/add', newClient);
        setClients(prev => [...prev, res.data.client]);
      }
      setNewClient(null);
    } catch (error) {
      console.error("There was an error saving the client:", error);
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      await axios.delete(`/api/clients/${id}`);
      setClients(prev => prev.filter(client => client._id !== id));
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleEditClient = (client) => {
    setNewClient(client);
  };

  const handleChange = (e, field) => {
    setNewClient({ ...newClient, [field]: e.target.value });
  };

  // Filter clients based on search term (name, email, company)
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export filtered clients as PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Clients List', 14, 15);

    const tableColumn = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Join Date'];
    const tableRows = [];

    filteredClients.forEach(client => {
      const clientData = [
        client.name,
        client.email,
        client.phone,
        client.company,
        client.status,
        new Date(client.joinDate).toLocaleDateString(),
      ];
      tableRows.push(clientData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 136, 229] }, // blue header
    });

    doc.save('clients-list.pdf');
  };

  return (
    <div className="clients-container">
      <div className="clients-header">
        <h2>Clients</h2>
        <p>Manage your client information</p>
      </div>

      <div className="clients-controls">
        <input
          type="text"
          placeholder="Search by name, email or company..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <button className="export-btn" onClick={exportPDF}>
            <PictureAsPdf fontSize="small" /> Export PDF
          </button>
          <button className="add-btn" onClick={handleAddClient}>+ Add New</button>
        </div>
      </div>

      <div className="clients-table-container">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client._id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.company}</td>
                <td>
                  <span className={`status-badge ${client.status.toLowerCase()}`}>
                    {client.status}
                  </span>
                </td>
                <td>{new Date(client.joinDate).toLocaleDateString()}</td>
                <td>
                  <Tooltip title="Edit" arrow>
                    <IconButton onClick={() => handleEditClient(client)} sx={{ color: '#0ea5e9' }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <IconButton onClick={() => handleDeleteClient(client._id)} sx={{ color: '#ef4444' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}

            {newClient && (
              <tr>
                <td><input type="text" value={newClient.name} onChange={(e) => handleChange(e, 'name')} /></td>
                <td><input type="email" value={newClient.email} onChange={(e) => handleChange(e, 'email')} /></td>
                <td><input type="text" value={newClient.phone} onChange={(e) => handleChange(e, 'phone')} /></td>
                <td><input type="text" value={newClient.company} onChange={(e) => handleChange(e, 'company')} /></td>
                <td>
                  <select value={newClient.status} onChange={(e) => handleChange(e, 'status')}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td>
                  <input
                    type="date"
                    value={newClient.joinDate}
                    onChange={(e) => handleChange(e, 'joinDate')}
                  />
                </td>
                <td><button onClick={handleSaveClient}>Save</button></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
