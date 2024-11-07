import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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
} from '@mui/material';
import API_BASE_URL from '../config';

const NewSale = () => {
    const { customerId } = useParams();  

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [productList, setProductList] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [saleDate, setSaleDate] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/products`)
      .then((response) => setProducts(response.data))
      .catch(() => setError('Error al obtener los productos'));
  }, []);


  useEffect(() => {
    console.log("Customer ID desde URL:", customerId); 
    if (!customerId) {
      setError('No se encontró un ID de cliente en la URL');
    }
  }, [customerId]);

  const addProduct = () => {
    const productDetails = products.find((product) => product.id === parseInt(selectedProduct));
    if (productDetails) {
      setProductList([
        ...productList,
        { ...productDetails, quantity: parseInt(quantity) },
      ]);
      setSelectedProduct('');
      setQuantity(1);
    }
  };

  const finalizeSale = async () => {
    try {
      const calculatedAmount = productList.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const saleAmount = totalAmount > 0 ? parseFloat(totalAmount) : calculatedAmount;

      const saleData = {
        amount: saleAmount,
        methodOfPayment: paymentMethod,
        date: saleDate,
        customerId: parseInt(customerId),  
      };

      console.log("Datos de la venta enviados:", saleData);  
      const saleResponse = await axios.post(`${API_BASE_URL}/sales`, saleData, {
        headers: { 'Content-Type': 'application/json' },
      });
      const saleId = saleResponse.data.id;

      const productPromises = productList.map((item) =>
        axios.post(
          `${API_BASE_URL}/sales/${saleId}/products`,
          { productId: item.id, amount: item.quantity },
          { headers: { 'Content-Type': 'application/json' } }
        )
      );

      await Promise.all(productPromises);

      alert('Venta finalizada con éxito');
      setProductList([]);
      setTotalAmount(0);
      setPaymentMethod('');
      setSaleDate('');
    } catch (error) {
      setError('Hubo un error al finalizar la venta');
      console.error("Error al finalizar la venta:", error); 
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Registrar Venta
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" noValidate autoComplete="off">
        <FormControl fullWidth margin="normal">
          <InputLabel>Producto</InputLabel>
          <Select
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
          </Select>
        </FormControl>

        <TextField
          label="Cantidad"
          type="number"
          inputProps={{ min: 1 }}
          fullWidth
          margin="normal"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <Button variant="contained" color="secondary" onClick={addProduct} sx={{ mt: 2 }}>
          Agregar Producto
        </Button>
      </Box>

      <Typography variant="h5" sx={{ mt: 4 }}>
        Lista de Productos
      </Typography>
      <List>
        {productList.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={`${item.name} - Cantidad: ${item.quantity}`}
                secondary={`Precio: $${item.price * item.quantity}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      <TextField
        label="Forma de Pago"
        fullWidth
        margin="normal"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      />

      <TextField
        label="Monto Total"
        type="number"
        fullWidth
        margin="normal"
        inputProps={{ min: 0 }}
        value={totalAmount}
        onChange={(e) => setTotalAmount(parseFloat(e.target.value))}
      />

      <TextField
        label="Fecha de la Venta"
        type="date"
        fullWidth
        margin="normal"
        value={saleDate}
        onChange={(e) => setSaleDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Button variant="contained" color="primary" onClick={finalizeSale} sx={{ mt: 3 }}>
        Finalizar Venta
      </Button>
    </Container>
  );
};

export default NewSale;
