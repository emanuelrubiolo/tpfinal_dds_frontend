import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Container, Box, Typography, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import API_BASE_URL from '../config';
import { styled } from '@mui/material/styles';

const DarkContainer = styled(Container)({
  background: 'linear-gradient(145deg, #1b1e28, #23262f)',
  padding: '30px',
  borderRadius: '32px',
  boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.4)',
  color: '#fff',
  fontFamily: 'Montserrat',
});

const DarkPageContainer = styled('div')({
  minHeight: '100vh',
  backgroundColor: '#121212',
  padding: '40px 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ProductCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#1b1e28',
  color: '#e0e0e3',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: '24px',
  boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(10px)',
}));

const Products = () => {
  const [products, setProducts] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, productId: null });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get(`${API_BASE_URL}/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/products/${id}`)
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
        setDeleteDialog({ open: false, productId: null });
      })
      .catch((error) => {
        console.error('Error al eliminar el producto:', error);
      });
  };

  return (
    <DarkPageContainer>
      <DarkContainer maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>
          Productos
        </Typography>

        {products.length === 0 ? (
          <Typography variant="h6" color="gray">
            No hay productos disponibles.
          </Typography>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id}>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="gray">{product.category}</Typography>
                <Box mt={2} sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    component={Link}
                    to={`/products/${product.id}/edit`}
                    variant="contained"
                    color="secondary"
                    sx={{ borderRadius: '50px' }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ borderRadius: '50px' }}
                    onClick={() => setDeleteDialog({ open: true, productId: product.id })}
                  >
                    Eliminar
                  </Button>
                </Box>
              </CardContent>
            </ProductCard>
          ))
        )}

        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, productId: null })}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Confirmar eliminacion de producto?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, productId: null })} color="primary">
              Cancelar
            </Button>
            <Button onClick={() => handleDelete(deleteDialog.productId)} color="error">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </DarkContainer>
    </DarkPageContainer>
  );
};

export default Products;
