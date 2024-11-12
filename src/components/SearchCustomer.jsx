import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { CustomerContext } from "../context/CustomerContext";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import API_BASE_URL from "../config";

const DarkBackgroundContainer = styled(Box)({
  minHeight: "100vh",
  backgroundColor: "#121212",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
});

const DarkCard = styled(Card)({
  backgroundColor: "#1b1e28",
  color: "#e0e0e3",
  padding: "30px",
  borderRadius: "24px",
  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.6)",
});

const CustomTextField = styled(TextField)({
  "& label": {
    color: "#9e9e9e",
  },
  "& .MuiInputBase-input": {
    color: "#e0e0e3",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#575a6a",
      borderRadius: "16px",
    },
    "&:hover fieldset": {
      borderColor: "#ff4081",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ff79b0",
    },
  },
});

const SearchCustomer = () => {
  const { selectCustomer } = useContext(CustomerContext);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityTerm, setCityTerm] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = (query = "") => {
    axios
      .get(`${API_BASE_URL}/customers${query}`)
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los clientes:", error);
        setError("Error al obtener los clientes");
      });
  };

  const handleSearch = () => {
    const queryParts = [];
    if (searchTerm)
      queryParts.push(
        `name=${encodeURIComponent(searchTerm)}&lastName=${encodeURIComponent(
          searchTerm
        )}`
      );
    if (cityTerm) queryParts.push(`city=${encodeURIComponent(cityTerm)}`);

    const query = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
    fetchCustomers(query);
  };

  const handleSelectCustomer = (customer) => {
    selectCustomer(customer);
    navigate(`/customers/${customer.id}`);
  };

  const handleDeleteCustomer = async (event, customerId) => {
    event.stopPropagation();
    try {
      await axios.delete(`${API_BASE_URL}/customers/${customerId}`);
      setCustomers(customers.filter((customer) => customer.id !== customerId));
      alert("Cliente eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
      setError("Hubo un error al eliminar el cliente");
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
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            color: "#e0e0e3",
          }}
        >
          Buscar Cliente
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <DarkCard>
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <CustomTextField
                label="Buscar por nombre o apellido"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
            <Box display="flex" alignItems="center" mb={3}>
              <CustomTextField
                label="Buscar por ciudad"
                variant="outlined"
                fullWidth
                value={cityTerm}
                onChange={(e) => setCityTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
  {customers.map((customer) => (
    <Card
      key={customer.id}
      sx={{
        backgroundColor: "#42464d", 
        marginBottom: "8px", 
        borderRadius: "12px", 
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)", 
      }}
    >
      <CardContent>
        <ListItem
          disablePadding
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
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(255, 64, 129, 0.1)",
            },
          }}
          onClick={() => handleSelectCustomer(customer)}
        >
          <ListItemText
  primary={`${customer.name} ${customer.lastName}`}
  secondary={`${
    customer.phone ? `${customer.phone} - ` : ""
  }${customer.location.city}`}
  sx={{
    color: "#e0e0e3",
    "& .MuiListItemText-secondary": { color: "#e0e0e3" }, 
  }}
/>

        </ListItem>
      </CardContent>
    </Card>
  ))}
</List>
          </CardContent>
        </DarkCard>
      </Container>
    </DarkBackgroundContainer>
  );
};

export default SearchCustomer;
