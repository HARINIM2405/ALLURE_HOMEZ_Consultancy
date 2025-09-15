import { AppBar, Toolbar, Button, IconButton, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import '@fontsource/montserrat';

const Navbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#87CEEB',
        boxShadow: 'none',
        zIndex: 1300,
        height: '60px',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            color: 'black',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          𝐀𝐥𝐥𝐮𝐫𝐞𝐇𝐨𝐦𝐞𝐳
        </Typography>

        <Box sx={{ display: 'flex', gap: '30px' }}>
          <Button component={Link} to="/" sx={navButtonStyle}>Home</Button>
          <Button component={Link} to="/portfolio" sx={navButtonStyle}>Portfolio</Button>
          <Button component={Link} to="/shop" sx={navButtonStyle}>Shop</Button>
        </Box>

        <Box sx={{ display: 'flex', gap: '20px' }}>
          <IconButton component={Link} to="/login" sx={{ fontSize: '1.6rem', color: 'black' }}>
            <AdminPanelSettingsIcon sx={{ fontSize: '2rem' }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const navButtonStyle = {
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: '600',
  textTransform: 'none',
  fontSize: '1rem',
  color: 'black',
  '&:hover': {
    color: 'blue',
  },
};

export default Navbar;
