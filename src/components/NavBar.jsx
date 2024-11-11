import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import "@fontsource/montserrat";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#1b1e28",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.4)",
});

const StyledLink = styled(Typography)({
  color: "#ECF0F1",
  textDecoration: "none",
  fontFamily: "Montserrat",
  fontWeight: "500",
  marginRight: "16px",
  "&:hover": {
    color: "#ff79b0",
  },
});

const StyledMenu = styled(Menu)({
  "& .MuiPaper-root": {
    backgroundColor: "#2c2f36",
    color: "#ECF0F1",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
  },
});

const StyledMenuItem = styled(MenuItem)({
  color: "#ECF0F1",
  fontFamily: "Montserrat",
  "&:hover": {
    backgroundColor: "rgba(255, 121, 176, 0.2)",
    color: "#ff79b0",
  },
});

const NavBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [localitiesMenu, setLocalitiesMenu] = React.useState(null);
  const [productsMenu, setProductsMenu] = React.useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const openLocalitiesMenu = (event) => setLocalitiesMenu(event.currentTarget);
  const closeLocalitiesMenu = () => setLocalitiesMenu(null);

  const openProductsMenu = (event) => setProductsMenu(event.currentTarget);
  const closeProductsMenu = () => setProductsMenu(null);

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <StyledLink
          variant="h6"
          component={Link}
          to="/"
          sx={{
            fontWeight: "bold",
            flexGrow: 1,
          }}
        >
          Clientes
        </StyledLink>

        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <StyledLink component={Link} to="/customers/new">
            Nuevo Cliente
          </StyledLink>

          <Box>
            <StyledLink
              onClick={openLocalitiesMenu}
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              Localidades <ArrowDropDownIcon />
            </StyledLink>
            <StyledMenu
              anchorEl={localitiesMenu}
              open={Boolean(localitiesMenu)}
              onClose={closeLocalitiesMenu}
            >
              <StyledMenuItem
                component={Link}
                to="/new-location"
                onClick={closeLocalitiesMenu}
              >
                Nueva Localidad
              </StyledMenuItem>
              <StyledMenuItem
                component={Link}
                to="/locations"
                onClick={closeLocalitiesMenu}
              >
                Editar localidades
              </StyledMenuItem>
            </StyledMenu>
          </Box>

          <Box>
            <StyledLink
              onClick={openProductsMenu}
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              Productos <ArrowDropDownIcon />
            </StyledLink>
            <StyledMenu
              anchorEl={productsMenu}
              open={Boolean(productsMenu)}
              onClose={closeProductsMenu}
            >
              <StyledMenuItem
                component={Link}
                to="/new-product"
                onClick={closeProductsMenu}
              >
                Nuevo Producto
              </StyledMenuItem>
              <StyledMenuItem
                component={Link}
                to="/products"
                onClick={closeProductsMenu}
              >
                Editar productos
              </StyledMenuItem>
            </StyledMenu>
          </Box>
        </Box>

        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <StyledMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <StyledMenuItem
              component={Link}
              to="/customers/new"
              onClick={handleClose}
            >
              Nuevo Cliente
            </StyledMenuItem>
            <StyledMenuItem
              component={Link}
              to="/new-location"
              onClick={handleClose}
            >
              Nueva Localidad
            </StyledMenuItem>
            <StyledMenuItem
              component={Link}
              to="/locations"
              onClick={handleClose}
            >
              Editar localidades
            </StyledMenuItem>
            <StyledMenuItem
              component={Link}
              to="/new-product"
              onClick={handleClose}
            >
              Nuevo Producto
            </StyledMenuItem>
            <StyledMenuItem
              component={Link}
              to="/products"
              onClick={handleClose}
            >
              Editar productos
            </StyledMenuItem>
          </StyledMenu>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default NavBar;
