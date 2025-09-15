import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const categories = ['Curtains', 'Cushions', 'Bedding', 'Kitchen', 'Towel'];

const Product = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0],
    details: '',
    price: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState(categories[0]);
  const [message, setMessage] = useState({ text: '', severity: 'success' });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // For edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    _id: '',
    name: '',
    category: '',
    details: '',
    price: '',
  });
  const [editImageFile, setEditImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage({ text: 'Error fetching products', severity: 'error' });
      setOpenSnackbar(true);
    }
  };

  // Create form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (imageFile) {
        const imgForm = new FormData();
        imgForm.append('image', imageFile);
        const uploadRes = await axios.post('http://localhost:5000/api/uploads', imgForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadRes.data.imageUrl;
      }

      await axios.post('http://localhost:5000/api/products', {
        ...formData,
        image: imageUrl,
      });

      setMessage({ text: 'Product added successfully!', severity: 'success' });
      setOpenSnackbar(true);
      setFormData({ name: '', category: categories[0], details: '', price: '' });
      setImageFile(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Error uploading product.', severity: 'error' });
      setOpenSnackbar(true);
    }
  };

  // Edit handlers
  const openEditDialog = (product) => {
    setEditData({
      _id: product._id,
      name: product.name,
      category: product.category,
      details: product.details,
      price: product.price,
      image: product.image || '',
    });
    setEditImageFile(null);
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditFileChange = (e) => {
    setEditImageFile(e.target.files[0]);
  };

  const handleEditSubmit = async () => {
    try {
      let imageUrl = editData.image; // existing image by default
      if (editImageFile) {
        const imgForm = new FormData();
        imgForm.append('image', editImageFile);
        const uploadRes = await axios.post('http://localhost:5000/api/uploads', imgForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadRes.data.imageUrl;
      }

      await axios.put(`http://localhost:5000/api/products/${editData._id}`, {
        name: editData.name,
        category: editData.category,
        details: editData.details,
        price: editData.price,
        image: imageUrl,
      });

      setMessage({ text: 'Product updated successfully!', severity: 'success' });
      setOpenSnackbar(true);
      setEditOpen(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Error updating product.', severity: 'error' });
      setOpenSnackbar(true);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setMessage({ text: 'Product deleted successfully!', severity: 'success' });
      setOpenSnackbar(true);
      fetchProducts();
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Error deleting product.', severity: 'error' });
      setOpenSnackbar(true);
    }
  };

  // Filter products by category only
  const displayedProducts = products.filter((p) => p.category === filterCategory);

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" mb={3} textAlign="center">
        Add Product
      </Typography>

      <Paper sx={{ p: 3, mb: 5 }} elevation={3}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
          />

          <InputLabel id="category-label" sx={{ mt: 2 }}>
            Category
          </InputLabel>
          <Select
            labelId="category-label"
            name="category"
            value={formData.category}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            margin="normal"
            type="number"
            inputProps={{ min: 0, step: '0.01' }}
          />

          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Image
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {imageFile && (
            <Typography variant="body2" mt={1}>
              Selected: {imageFile.name}
            </Typography>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 4 }}>
            Add Product
          </Button>
        </form>
      </Paper>

      <Typography variant="h5" mb={2} textAlign="center">
        Products in "{filterCategory}"
      </Typography>

      <InputLabel id="filter-category-label" sx={{ mb: 1 }}>
        Select Category
      </InputLabel>
      <Select
        labelId="filter-category-label"
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      >
        {categories.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </Select>

      {/* Product List with Edit/Delete */}
      {displayedProducts.length === 0 ? (
        <Typography variant="body1" textAlign="center">
          No products found in this category.
        </Typography>
      ) : (
        <Box>
          {displayedProducts.map((product) => (
            <Paper
              key={product._id}
              sx={{
                p: 2,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              elevation={2}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {product.details || '-'}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  ${product.price}
                </Typography>
              </Box>

              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mr: 1 }}
                  onClick={() => openEditDialog(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={editData.name}
            onChange={handleEditChange}
            required
            margin="normal"
          />

          <InputLabel id="edit-category-label" sx={{ mt: 2 }}>
            Category
          </InputLabel>
          <Select
            labelId="edit-category-label"
            name="category"
            value={editData.category}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Details"
            name="details"
            value={editData.details}
            onChange={handleEditChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Price"
            name="price"
            value={editData.price}
            onChange={handleEditChange}
            required
            margin="normal"
            type="number"
            inputProps={{ min: 0, step: '0.01' }}
          />

          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload New Image (optional)
            <input type="file" hidden accept="image/*" onChange={handleEditFileChange} />
          </Button>
          {editImageFile && (
            <Typography variant="body2" mt={1}>
              Selected: {editImageFile.name}
            </Typography>
          )}
          {!editImageFile && editData.image && (
            <Typography variant="body2" mt={1} color="text.secondary">
              Current image: {editData.image.split('/').pop()}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={message.severity}
          sx={{ width: '100%' }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Product;
