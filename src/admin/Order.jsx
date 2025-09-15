import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Box,
  Stack,
  TextField,
} from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';  // <-- Import autoTable explicitly

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleDelivery = async (orderId, newStatus) => {
    setUpdatingId(orderId);

    // Optimistic UI update
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, isDelivered: newStatus } : order
      )
    );

    try {
      const res = await axios.patch(`http://localhost:5000/api/orders/${orderId}`, {
        isDelivered: newStatus,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, isDelivered: res.data.isDelivered } : order
        )
      );
    } catch (err) {
      console.error('Failed to update delivery status:', err);
      // revert on error
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, isDelivered: !newStatus } : order
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter orders by search term
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      order.name.toLowerCase().includes(term) ||
      order.email.toLowerCase().includes(term) ||
      (order.product?.name?.toLowerCase().includes(term) ?? false) ||
      order.location.toLowerCase().includes(term)
    );
  });

  // Export filtered orders as PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Orders List', 14, 15);

    const tableColumn = ['Name', 'Email', 'Product', 'Quantity', 'City', 'Delivered'];
    const tableRows = [];

    filteredOrders.forEach((order) => {
      const orderData = [
        order.name,
        order.email,
        order.product?.name || 'N/A',
        order.quantity.toString(),
        order.location,
        order.isDelivered ? 'Yes' : 'No',
      ];
      tableRows.push(orderData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 136, 229] },
    });

    doc.save('orders-list.pdf');
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: '100vh',
        py: 6,
        px: 4,
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        color="primary"
        fontWeight={700}
        sx={{ mb: 2 }}
      >
        Orders Dashboard
      </Typography>

      {/* Search + Export Controls */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: '100%', maxWidth: 1200, mb: 3 }}
      >
        <TextField
          label="Search by name, email, product, or city"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />

        <Button
          variant="contained"
          startIcon={<PictureAsPdf />}
          onClick={exportPDF}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Export PDF
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : filteredOrders.length === 0 ? (
        <Typography align="center" variant="h6" color="text.secondary">
          No orders found.
        </Typography>
      ) : (
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 1200,
            overflowX: 'auto',
            borderRadius: 2,
            p: 2,
          }}
        >
          <Table
            stickyHeader
            sx={{
              minWidth: 900,
              '& th, & td': {
                fontSize: '1rem',
                py: 1.75,
                px: 2,
                color: 'text.primary',
              },
              '& thead th': {
                backgroundColor: 'primary.main',
                color: 'common.white',
                fontWeight: 'bold',
              },
              '& tbody tr:hover': {
                backgroundColor: 'action.hover',
              },
              '& tbody tr:nth-of-type(odd)': {
                backgroundColor: 'action.selected',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>City</TableCell>
                <TableCell align="center">Delivered</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>{order.name}</TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell>{order.product?.name || 'N/A'}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.location}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant={order.isDelivered ? 'contained' : 'outlined'}
                        color="success"
                        size="small"
                        disabled={updatingId === order._id}
                        onClick={() => toggleDelivery(order._id, true)}
                      >
                        Yes
                      </Button>
                      <Button
                        variant={!order.isDelivered ? 'contained' : 'outlined'}
                        color="error"
                        size="small"
                        disabled={updatingId === order._id}
                        onClick={() => toggleDelivery(order._id, false)}
                      >
                        No
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default Orders;
