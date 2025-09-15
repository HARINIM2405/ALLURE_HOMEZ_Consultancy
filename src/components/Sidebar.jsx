import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider
} from '@mui/material';
import {
  Dashboard,
  People,
  Work,
  Inventory,
  Collections,
  QuestionAnswer,
  ShoppingCart,
  Category,
  Logout
} from '@mui/icons-material';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const sideMenu = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Clients', icon: <People />, path: '/admin/clients' },
    { text: 'Workers', icon: <Work />, path: '/admin/workers' },
    { text: 'Stock', icon: <Inventory />, path: '/admin/stock' },
    { text: 'Order', icon: <ShoppingCart />, path: '/admin/order' },
    { text: 'Product', icon: <Category />, path: '/admin/product' },
    { text: 'Portfolio', icon: <Collections />, path: '/admin/portfoliopage' },
    { text: 'Enquiries', icon: <QuestionAnswer />, path: '/admin/enquiriespage' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          '& .MuiDrawer-paper': {
            width: 240,
            backgroundColor: '#111827',
            color: '#fff',
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: 'center',
            backgroundColor: '#1f2937',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            letterSpacing: '2px',
            userSelect: 'none',
            height: 64,
          }}
        >
          ALLURE HOMEZ
        </Box>

        <List>
          {sideMenu.map((item) => (
            <ListItem
              key={item.text}
              component={NavLink}
              to={item.path}
              sx={({ isActive }) => ({
                backgroundColor: isActive ? '#4c8bf5' : 'transparent',
                color: isActive ? '#fff' : '#b0b0b0',
                '&:hover': {
                  backgroundColor: '#A78BFA',
                  color: '#fff',
                },
                textDecoration: 'none',
              })}
            >
              <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2, borderColor: '#444' }} />

        <Box sx={{ px: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Logout />}
            fullWidth
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Sidebar;
