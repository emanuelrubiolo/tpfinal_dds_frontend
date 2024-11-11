import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { CustomerContext } from '../context/CustomerContext';
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  InputAdornment,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import API_BASE_URL from '../config';


const DarkBackgroundContainer = styled(Box)({
  minHeight: '100vh',
  backgroundColor: '#121212',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
});

const DarkCard = styled(Card)({
  backgroundColor: '#1b1e28',
  color: '#e0e0e3',
  padding: '30px',
  borderRadius: '24px',
  boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.6)',
});

const CustomTextField = styled(TextField)({
  '& label': {
    color: '#9e9e9e',
  },
  '& .MuiInputBase-input': {
    color: '#e0e0e3',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#575a6a',
      borderRadius: '16px',
    },
    '&:hover fieldset': {
      borderColor: '#ff4081',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ff79b0',
    },
  },
});

const SearchCustomer = () => {
  const { selectCustomer } = useContext(CustomerContext);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [error, setError] = useState(null);
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
        setError('Error al obtener los clientes');
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
      setError('Hubo un error al eliminar el cliente');
    }
  };

  const handleEditCustomer = (event, customer) => {
    event.stopPropagation();
    selectCustomer(customer);
    navigate(`/customers/${customer.id}/edit`);
  };

  return (
    <DarkBackgroundContainer>
      <Container maxWidth="sm">
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontFamily: 'Montserrat', fontWeight: 'bold', color: '#e0e0e3' }}
        >
          Buscar Cliente
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <DarkCard>
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <CustomTextField
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
                      backgroundColor: 'rgba(255, 64, 129, 0.1)',
                    },
                  }}
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <ListItemText
                    primary={`${customer.name} ${customer.lastName}`}
                    secondary={customer.phone}
                    sx={{ color: '#e0e0e3' }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </DarkCard>
      </Container>
    </DarkBackgroundContainer>
  );
};

export default SearchCustomer;
