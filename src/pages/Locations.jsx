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

const LocationCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#1b1e28',
  color: '#e0e0e3',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: '24px',
  boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(10px)',
}));

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, locationId: null });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    axios.get(`${API_BASE_URL}/locations`)
      .then((response) => {
        setLocations(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener las localidades:', error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/locations/${id}`)
      .then(() => {
        setLocations(locations.filter((location) => location.id !== id));
        setDeleteDialog({ open: false, locationId: null });
      })
      .catch((error) => {
        console.error('Error al eliminar la localidad:', error);
      });
  };

  return (
    <DarkPageContainer>
      <DarkContainer maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>
          Localidades
        </Typography>

        {locations.length === 0 ? (
          <Typography variant="h6" color="gray">
            No hay localidades disponibles.
          </Typography>
        ) : (
          locations.map((location) => (
            <LocationCard key={location.id}>
              <CardContent>
                <Typography variant="h6">{location.city}, {location.province}</Typography>
                <Box mt={2} sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    component={Link}
                    to={`/locations/${location.id}/edit`}
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
                    onClick={() => setDeleteDialog({ open: true, locationId: location.id })}
                  >
                    Eliminar
                  </Button>
                </Box>
              </CardContent>
            </LocationCard>
          ))
        )}

        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, locationId: null })}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Confirmar eliminacion de localidad?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, locationId: null })} color="primary">
              Cancelar
            </Button>
            <Button onClick={() => handleDelete(deleteDialog.locationId)} color="error">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </DarkContainer>
    </DarkPageContainer>
  );
};

export default Locations;
