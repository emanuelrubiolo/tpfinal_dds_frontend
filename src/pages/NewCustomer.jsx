import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Card, CardContent, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import API_BASE_URL from '../config';
import { CustomerContext } from '../context/CustomerContext';

const NewCustomer = () => {
  const { addCustomer, updateCustomer } = useContext(CustomerContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [locationId, setLocationId] = useState('');
  const [locations, setLocations] = useState([]); 
  const [error, setError] = useState(null);

  useEffect(() => {

    axios.get(`${API_BASE_URL}/locations`)
      .then(response => setLocations(response.data))
      .catch(error => {
        console.error('Error al cargar las localidades:', error);
        setError('Error al cargar las localidades');
      });

  
    if (id) {
      axios.get(`${API_BASE_URL}/customers/${id}`)
        .then(response => {
          const { name, lastName, phone, comment, locationId } = response.data;
          setName(name || '');
          setLastName(lastName || '');
          setPhone(phone || '');
          setComment(comment || '');
          setLocationId(locationId || ''); 
        })
        .catch(error => {
          console.error('Error al cargar los datos del cliente:', error);
          setError('Error al cargar los datos del cliente');
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const customerData = {
      id: id ? Number(id) : undefined,
      name,
      lastName,
      phone: phone.trim() === '' ? null : phone,
      comment: comment.trim() === '' ? null : comment,
      locationId: locationId || null, 
    };

    const request = id 
      ? axios.put(`${API_BASE_URL}/customers/${id}`, customerData)
      : axios.post(`${API_BASE_URL}/customers`, customerData);

    request
      .then(response => {
        id ? updateCustomer(customerData) : addCustomer(response.data);
        alert(`Cliente ${id ? 'actualizado' : 'creado'} exitosamente`);
        navigate('/');
      })
      .catch(error => {
        console.error(`Error al ${id ? 'actualizar' : 'crear'} el cliente:`, error);
        setError(`Error al ${id ? 'actualizar' : 'crear'} el cliente`);
      });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        {id ? 'Editar Cliente' : 'Nuevo Cliente'}
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
                label="Apellido"
                fullWidth
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Teléfono"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Comentario"
                multiline
                rows={3}
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel>Localidad</InputLabel>
                <Select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  label="Localidad"
                  required
                >
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.city} - {location.province}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
            >
              {id ? 'Guardar Cambios' : 'Crear Cliente'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NewCustomer;
