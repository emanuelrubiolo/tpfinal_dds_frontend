import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Card, CardContent, Alert } from '@mui/material';
import API_BASE_URL from '../config';
import { LocationContext } from '../context/LocationContext';

const NewLocation = () => {
  const { addLocation } = useContext(LocationContext);
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const locationData = {
      city: city.trim(),
      province: province.trim(),
    };

    axios.post(`${API_BASE_URL}/locations`, locationData)
      .then((response) => {
        addLocation(response.data); 
        alert('Localidad creada exitosamente');
        navigate('/'); 
      })
      .catch((error) => {
        console.error('Error al crear la localidad:', error);
        setError('Error al crear la localidad');
      });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Nueva Localidad
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Card sx={{ backgroundColor: '#f0f4f8', padding: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                label="Ciudad"
                fullWidth
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Provincia"
                fullWidth
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
            >
              Crear Localidad
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NewLocation;
