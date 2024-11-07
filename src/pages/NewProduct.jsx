import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Card, CardContent, Alert } from '@mui/material';
import { ProductContext } from '../context/ProductContext';
import API_BASE_URL from '../config';

const NewProduct = () => {
  const { addProduct } = useContext(ProductContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.trim() === '') {
      setError('El nombre del producto es obligatorio.');
      return;
    }

    const productData = {
      name: name.trim(),
      category: category.trim() === '' ? null : category.trim(),
      description: description.trim() === '' ? null : description.trim(),
    };

    axios.post(`${API_BASE_URL}/products`, productData)
      .then((response) => {
        addProduct(response.data);
        alert('Producto creado exitosamente');
        navigate('/');
      })
      .catch((error) => {
        console.error('Error al crear el producto:', error);
        setError('Error al crear el producto');
      });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Nuevo Producto
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Card sx={{ backgroundColor: '#f0f4f8', padding: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                label="Nombre"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Categoría"
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Descripción"
                multiline
                rows={3}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
            >
              Crear Producto
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NewProduct;
