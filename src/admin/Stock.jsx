import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Stock.css';
import { IconButton, Tooltip } from '@mui/material';
import { Edit, Delete, PictureAsPdf } from '@mui/icons-material';
import { jsPDF } from 'jspdf';        // Correct named import
import autoTable from 'jspdf-autotable';  // Import the autoTable function

const Stock = () => {
  const [stockItems, setStockItems] = useState([]);
  const [newItem, setNewItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        const res = await axios.get('/api/stocks');
        setStockItems(res.data);
      } catch (err) {
        console.error('Error fetching stock items', err);
        setStockItems([]);
      }
    };
    fetchStockItems();
  }, []);

  const handleAddNew = () => {
    setNewItem({
      name: '',
      category: '',
      quantity: '',
      price: '',
      supplier: '',
      status: 'Available',
      lastUpdated: new Date().toISOString().split('T')[0],
    });
    setIsEditing(false);
  };

  const handleChange = (e, field) => {
    setNewItem({ ...newItem, [field]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (isEditing && newItem._id) {
        const res = await axios.put(`/api/stocks/${newItem._id}`, newItem);
        setStockItems(prev =>
          prev.map(item => (item._id === newItem._id ? res.data.stock : item))
        );
      } else {
        const res = await axios.post('/api/stocks/add', newItem);
        setStockItems(prev => [...prev, res.data.stock]);
      }
      setNewItem(null);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving stock item:', err);
    }
  };

  const handleEdit = (index) => {
    setNewItem(stockItems[index]);
    setStockItems(prev => prev.filter((_, i) => i !== index));
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/stocks/${id}`);
      setStockItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error deleting stock item:', err);
    }
  };

  // Filter stock items based on search term (name, category, supplier)
  const filteredStockItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export filtered stock items as PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Stock Items List', 14, 15);

    const tableColumn = ['Name', 'Category', 'Quantity', 'Price', 'Supplier', 'Status', 'Last Updated'];
    const tableRows = [];

    filteredStockItems.forEach(item => {
      const itemData = [
        item.name,
        item.category,
        item.quantity.toString(),
        item.price.toString(),
        item.supplier,
        item.status,
        new Date(item.lastUpdated).toLocaleDateString(),
      ];
      tableRows.push(itemData);
    });

    // Correct usage of autoTable plugin
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 136, 229] }, // blue header
    });

    doc.save('stock-items-list.pdf');
  };

  return (
    <div className="stock-container">
      <div className="stock-header">
        <h2>Stock Management</h2>
        <p>Update or check stock information</p>
      </div>

      <div className="stock-controls">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name, category or supplier..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div>
          <button className="export-btn" onClick={exportPDF}>
            <PictureAsPdf fontSize="small" /> Export PDF
          </button>
          <button className="add-btn" onClick={handleAddNew}>+ Add New</button>
        </div>
      </div>

      <div className="stock-table-container">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStockItems.map((item, index) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.supplier}</td>
                <td>
                  <span className={`status-badge ${item.status.replace(/\s+/g, '-').toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
                <td>{new Date(item.lastUpdated).toLocaleDateString()}</td>
                <td>
                  <Tooltip title="Edit" arrow>
                    <IconButton onClick={() => handleEdit(index)} sx={{ color: '#0ea5e9' }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <IconButton onClick={() => handleDelete(item._id)} sx={{ color: '#ef4444' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}

            {newItem && (
              <tr>
                <td><input type="text" value={newItem.name} onChange={e => handleChange(e, 'name')} /></td>
                <td><input type="text" value={newItem.category} onChange={e => handleChange(e, 'category')} /></td>
                <td><input type="number" value={newItem.quantity} onChange={e => handleChange(e, 'quantity')} /></td>
                <td><input type="number" value={newItem.price} onChange={e => handleChange(e, 'price')} /></td>
                <td><input type="text" value={newItem.supplier} onChange={e => handleChange(e, 'supplier')} /></td>
                <td>
                  <select value={newItem.status} onChange={e => handleChange(e, 'status')}>
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </td>
                <td><input type="date" value={newItem.lastUpdated} onChange={e => handleChange(e, 'lastUpdated')} /></td>
                <td><button onClick={handleSave}>Save</button></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stock;
