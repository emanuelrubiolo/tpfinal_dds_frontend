
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { CustomerContext } from '../context/CustomerContext';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  InputAdornment,
  Container,
  Typography,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import API_BASE_URL from '../config';

const SearchCustomer = () => {
  const { selectCustomer } = useContext(CustomerContext);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/customers`)
      .then((response) => {
        setCustomers(response.data);
        setFilteredCustomers(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los clientes:', error);
      });
  }, []);

  const handleSearch = () => {
    const results = customers.filter(
      (customer) =>
        customer.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        (customer.lastName &&
          customer.lastName.toLowerCase().startsWith(searchTerm.toLowerCase())) ||
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(results);
  };

  const handleSelectCustomer = (customer) => {
    selectCustomer(customer);
    navigate(`/customers/${customer.id}`);
  };

  const handleDeleteCustomer = async (event, customerId) => {
    event.stopPropagation();
    try {
      await axios.delete(`${API_BASE_URL}/customers/${customerId}`);
      setFilteredCustomers(filteredCustomers.filter((customer) => customer.id !== customerId));
      setCustomers(customers.filter((customer) => customer.id !== customerId));
      alert('Cliente eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
      alert('Hubo un error al eliminar el cliente');
    }
  };

  const handleEditCustomer = (event, customer) => {
    event.stopPropagation();
    selectCustomer(customer);
    navigate(`/customers/${customer.id}/edit`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" color="primary" gutterBottom>
        Buscar Cliente
      </Typography>

      <Box display="flex" alignItems="center" mb={3}>
        <TextField
          label="Buscar cliente"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch} color="primary">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <List>
        {filteredCustomers.map((customer) => (
          <ListItem
            key={customer.id}
            secondaryAction={
              <Box>
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={(event) => handleEditCustomer(event, customer)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  color="error"
                  onClick={(event) => handleDeleteCustomer(event, customer.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
            onClick={() => handleSelectCustomer(customer)}
          >
            <ListItemText
              primary={`${customer.name} ${customer.lastName}`}
              secondary={customer.phone}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default SearchCustomer;
