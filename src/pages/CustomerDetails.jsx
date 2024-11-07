
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress, Button, Card, CardContent, List, ListItem, ListItemText, Alert } from '@mui/material';
import { CustomerContext } from '../context/CustomerContext';
import API_BASE_URL from '../config';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCustomer, selectCustomer } = useContext(CustomerContext);
  const [sales, setSales] = useState([]);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetchedCustomer, setHasFetchedCustomer] = useState(false);
  const [hasFetchedSales, setHasFetchedSales] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!hasFetchedCustomer && (!selectedCustomer || selectedCustomer.id !== id)) {
        try {
          setLoadingCustomer(true);
          const customerResponse = await axios.get(`${API_BASE_URL}/customers/${id}`);
          selectCustomer(customerResponse.data);
          setHasFetchedCustomer(true);
        } catch (err) {
          setError('Error al obtener los detalles del cliente');
          console.error(err);
        } finally {
          setLoadingCustomer(false);
        }
      } else {
        setLoadingCustomer(false);
      }
    };
    fetchCustomer();
  }, [id, hasFetchedCustomer, selectedCustomer, selectCustomer]);


  useEffect(() => {
    const fetchSales = async () => {
      if (!hasFetchedSales) {
        try {
          setLoadingSales(true);
          const salesResponse = await axios.get(`${API_BASE_URL}/customers/${id}/sales`);
          setSales(salesResponse.data);
          setHasFetchedSales(true);
        } catch (err) {
          setError('Error al obtener las ventas del cliente');
          console.error(err);
        } finally {
          setLoadingSales(false);
        }
      } else {
        setLoadingSales(false);
      }
    };
    fetchSales();
  }, [id, hasFetchedSales]);


  const handleAddSale = () => {
    navigate(`/customers/${id}/new-sale`);
  };

  if (loadingCustomer || loadingSales) return <CircularProgress color="primary" />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Detalles del Cliente
      </Typography>
      {selectedCustomer ? (
        <Card sx={{ mb: 4, backgroundColor: '#f0f4f8' }}>
          <CardContent>
            <Typography variant="h5" color="secondary">
              {selectedCustomer.name} {selectedCustomer.lastName}
            </Typography>
            {selectedCustomer.phone && (
              <Typography variant="body1">
                <strong>Teléfono:</strong> {selectedCustomer.phone}
              </Typography>
            )}
            {selectedCustomer.comment && (
              <Typography variant="body1">
                <strong>Comentario:</strong> {selectedCustomer.comment}
              </Typography>
            )}
            <Typography variant="body1">
              <strong>Dirección:</strong> {selectedCustomer.address || 'No disponible'}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {selectedCustomer.email || 'No disponible'}
            </Typography>
            <Typography variant="body1">
              <strong>Fecha de registro:</strong> {selectedCustomer.registrationDate ? new Date(selectedCustomer.registrationDate).toLocaleDateString() : 'No disponible'}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAddSale} sx={{ mt: 2 }}>
              Agregar Venta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1">No se encontraron detalles del cliente.</Typography>
      )}
      {sales.length === 0 ? (
        <Typography variant="body1">No se encontraron ventas para este cliente.</Typography>
      ) : (
        <List>
          {sales.map((sale) => (
            <ListItem key={sale.id} sx={{ backgroundColor: '#e8f0fe', mb: 1, borderRadius: 2 }}>
              <ListItemText
                primary={<strong>ID de venta:</strong>}
                secondary={`${sale.id} - ${new Date(sale.date).toLocaleDateString()}`}
              />
              <ListItemText
                primary={<strong>Total:</strong>}
                secondary={`$${sale.total}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default CustomerDetails;
