import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";
import { InputAdornment } from "@mui/material";

import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  InputLabel,
  FormControl,
  Alert,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import API_BASE_URL from "../config";
import "@fontsource/montserrat";

const LightSelect = styled(Select)({
  "& .MuiSelect-select": {
    color: "#ffffff",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#b3b3b3",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ffffff",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ffffff",
  },
});

const DarkPageContainer = styled("div")({
  minHeight: "100vh",
  backgroundColor: "#121212",
  padding: "40px 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const DarkContainer = styled(Container)({
  background: "linear-gradient(145deg, #1b1e28, #23262f)",
  padding: "30px",
  borderRadius: "32px",
  boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.4)",
  color: "#fff",
  fontFamily: "Montserrat",
});

const AccentButton = styled(Button)({
  backgroundColor: "#ff4081",
  color: "#fff",
  padding: "12px 24px",
  fontSize: "1rem",
  fontWeight: "bold",
  borderRadius: "50px",
  fontFamily: "Montserrat",
  boxShadow: "0px 4px 15px rgba(255, 64, 129, 0.4)",
  "&:hover": {
    backgroundColor: "#ff79b0",
    boxShadow: "0px 6px 20px rgba(255, 64, 129, 0.6)",
  },
});

const CustomTextField = styled(TextField)({
  "& label": {
    color: "#9e9e9e",
    fontFamily: "Montserrat",
  },
  "& .MuiInputBase-input": {
    color: "#e0e0e3",
    fontFamily: "Montserrat",
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

const NewSale = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [productList, setProductList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [saleDate, setSaleDate] = useState(null);
  const [error, setError] = useState(null);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/products`)
      .then((response) => setProducts(response.data))
      .catch(() => setError("Error al obtener los productos"));

    axios
      .get(`${API_BASE_URL}/customers/${customerId}`)
      .then((response) => setCustomer(response.data))
      .catch(() => setError("Error al obtener los datos del cliente"));
  }, [customerId]);

  const addProduct = () => {
    if (quantity <= 0) {
      setError("La cantidad debe ser mayor a cero");
      return;
    }
  
    const productDetails = products.find(
      (product) => product.id === parseInt(selectedProduct)
    );
  
    if (productDetails) {
      if (editingIndex !== null) {
        const updatedList = [...productList];
        updatedList[editingIndex] = {
          ...productDetails,
          quantity: parseInt(quantity),
        };
        setProductList(updatedList);
        setEditingIndex(null); 
      } else {
        const existingProductIndex = productList.findIndex(
          (product) => product.id === parseInt(selectedProduct)
        );
  
        if (existingProductIndex !== -1) {
          const updatedList = [...productList];
          updatedList[existingProductIndex].quantity += parseInt(quantity);
          setProductList(updatedList);
        } else {
          setProductList([
            ...productList,
            { ...productDetails, quantity: parseInt(quantity) },
          ]);
        }
      }
  
      setSelectedProduct("");
      setQuantity(1);
    }
  };
  

  const deleteProduct = (index) => {
    const updatedList = [...productList];
    updatedList.splice(index, 1);
    setProductList(updatedList);
  };

  const editProductQuantity = (index) => {
    setSelectedProduct(productList[index].id);
    setQuantity(productList[index].quantity);
    setEditingIndex(index);
  };

  const finalizeSale = async () => {
    if (totalAmount < 0) {
      setError("El monto total no puede ser negativo");
      return;
    }

    try {
      const saleData = {
        amount: parseFloat(totalAmount),
        methodOfPayment: paymentMethod,
        date: saleDate,
        customerId: parseInt(customerId),
      };

      let saleResponse;

      saleResponse = await axios.post(`${API_BASE_URL}/sales`, saleData);

      const id = saleResponse.data.id;

      const productPromises = productList.map((item) =>
        axios.post(`${API_BASE_URL}/sales/${id}/products`, {
          productId: item.id,
          amount: item.quantity,
        })
      );

      await Promise.all(productPromises);

      alert("Venta finalizada con éxito");
      navigate(`/customers/${customerId}`);
    } catch (error) {
      setError("Hubo un error al finalizar la venta");
      console.error("Error al finalizar la venta:", error);
    }
  };

  return (
    <DarkPageContainer>
      <DarkContainer maxWidth="sm">
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontFamily: "Montserrat", fontWeight: "bold" }}
        >
          Registrar Venta
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {customer && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">Datos del Cliente:</Typography>
            <Typography>Nombre: {customer.name}</Typography>
            <Typography>Apellido: {customer.lastName}</Typography>
            <Typography>Teléfono: {customer.phone}</Typography>
          </Box>
        )}

        <Box component="form" noValidate autoComplete="off">
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: "#9e9e9e", fontFamily: "Montserrat" }}>
              Producto
            </InputLabel>
            <LightSelect
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              label="Producto"
            >
              <MenuItem value="">
                <em>Seleccione un producto</em>
              </MenuItem>
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </LightSelect>
          </FormControl>

          <CustomTextField
            label="Cantidad"
            type="number"
            fullWidth
            margin="normal"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            slotProps={{
              htmlInput: {
                min: 1,
              },
            }}
          />

          <AccentButton onClick={addProduct} fullWidth sx={{ mt: 2 }}>
            {editingIndex !== null ? "Actualizar Producto" : "Agregar Producto"}
          </AccentButton>
        </Box>

        <Typography variant="h5" sx={{ mt: 4 }}>
          Lista de Productos
        </Typography>
        <List>
          {productList.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      onClick={() => editProductQuantity(index)}
                    >
                      <EditIcon sx={{ color: "#ff4081" }} />
                    </IconButton>
                    <IconButton edge="end" onClick={() => deleteProduct(index)}>
                      <DeleteIcon sx={{ color: "#ff4081" }} />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={`${item.name} - Cantidad: ${item.quantity}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        <CustomTextField
          label="Forma de Pago"
          fullWidth
          margin="normal"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />

        <CustomTextField
          label="Monto Total"
          fullWidth
          value={totalAmount}
          onChange={(e) => setTotalAmount(parseFloat(e.target.value))}
          sx={{ mt: 3 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            },
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            sx={{ mt: 2 }}
            label="Fecha de Venta"
            value={saleDate}
            onChange={(newDate) => setSaleDate(newDate)}
            renderInput={(params) => (
              <CustomTextField {...params} fullWidth margin="normal" />
            )}
          />
        </LocalizationProvider>

        {productList.length > 0 && (
          <AccentButton onClick={finalizeSale} fullWidth sx={{ mt: 3 }}>
            Finalizar Venta
          </AccentButton>
        )}
      </DarkContainer>
    </DarkPageContainer>
  );
};

export default NewSale;
