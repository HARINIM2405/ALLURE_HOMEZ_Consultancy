// src/admin/AdminLayout.jsx
import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar'; // ✅ This works because Sidebar is in components
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet /> {/* this is where each admin page will appear */}
      </Box>
    </Box>
  );
};

export default AdminLayout;
