
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#2C3E50' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            color: '#ECF0F1',
            textDecoration: 'none',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 'bold',
            flexGrow: 1,
          }}
        >
          Inicio
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Typography
            component={Link}
            to="/customers/new"
            sx={{
              color: '#ECF0F1',
              textDecoration: 'none',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 'medium',
              marginRight: 2,
            }}
          >
            Nuevo Cliente
          </Typography>
          <Typography
            component={Link}
            to="/new-product"
            sx={{
              color: '#ECF0F1',
              textDecoration: 'none',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 'medium',
              marginRight: 2,
            }}
          >
            Nuevo Producto
          </Typography>
          <Typography
            component={Link}
            to="/new-location"
            sx={{
              color: '#ECF0F1',
              textDecoration: 'none',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 'medium',
              marginRight: 2,
            }}
          >
            Nueva Localidad
          </Typography>
        </Box>

       
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={Link} to="/customers/new" onClick={handleClose}>
              Nuevo Cliente
            </MenuItem>
            <MenuItem component={Link} to="/new-product" onClick={handleClose}>
              Nuevo Producto
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
