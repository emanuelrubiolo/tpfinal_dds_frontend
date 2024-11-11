import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";

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
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import API_BASE_URL from "../config";
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
});

const AccentButton = styled(Button)({
  backgroundColor: "#ff4081",
  color: "#fff",
  padding: "12px 24px",
  fontWeight: "bold",
  borderRadius: "50px",
  "&:hover": {
    backgroundColor: "#ff79b0",
  },
});

const EditSale = () => {
  const { saleId } = useParams();
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [saleDate, setSaleDate] = useState(null);
  const [error, setError] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deletedProducts, setDeletedProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/sales/${saleId}`)
      .then((response) => {
        const sale = response.data;
        setTotalAmount(sale.amount);
        setSaleDate(new Date(sale.date));
        setPaymentMethod(sale.methodOfPayment);

        return axios.get(`${API_BASE_URL}/sales/${saleId}/products`);
      })
      .then((response) =>
        setProductList(
          response.data.map((product) => ({ ...product, isNew: false }))
        )
      )
      .catch(() => setError("Error al obtener los productos de la venta"));

    axios
      .get(`${API_BASE_URL}/products`)
      .then((response) => setProducts(response.data))
      .catch(() => setError("Error al obtener la lista de productos"));
  }, [saleId]);

  const addProduct = () => {
    if (quantity <= 0) {
      setError("La cantidad debe ser mayor a cero");
      return;
    }

    const productDetails = products.find(
      (product) => product.id === parseInt(selectedProduct)
    );

    if (productDetails) {
      const existingProductIndex = productList.findIndex(
        (product) => product.id === parseInt(selectedProduct)
      );

      if (existingProductIndex !== -1) {
        const updatedList = [...productList];
        updatedList[existingProductIndex].sale_items.amount += parseInt(
          quantity,
          10
        );
        setProductList(updatedList);
      } else if (editingIndex !== null) {
        const updatedList = [...productList];
        updatedList[editingIndex] = {
          ...updatedList[editingIndex],
          sale_items: { amount: parseInt(quantity, 10) },
        };
        setProductList(updatedList);
      } else {
        setProductList([
          ...productList,
          {
            ...productDetails,
            sale_items: { amount: parseInt(quantity, 10) },
            isNew: true,
          },
        ]);
      }

      setSelectedProduct("");
      setQuantity(1);
      setEditingIndex(null);
    } else {
      setError("Seleccione un producto y cantidad válida");
    }
  };

  const editProductQuantity = (index) => {
    setSelectedProduct(productList[index].id);
    setQuantity(productList[index].sale_items.amount);
    setEditingIndex(index);
  };

  const updateProduct = () => {
    const updatedList = [...productList];
    updatedList[editingIndex].sale_items.amount = parseInt(quantity, 10);
    setProductList(updatedList);
    setEditingIndex(null);
    setQuantity("");
    setSelectedProduct("");
  };

  const deleteProduct = (index) => {
    const updatedList = [...productList];
    const deletedProduct = updatedList.splice(index, 1)[0];
    if (!deletedProduct.isNew) {
      setDeletedProducts([...deletedProducts, deletedProduct]);
    }
    setProductList(updatedList);
  };

  const saveSale = async () => {
    try {
      const saleData = {
        id: saleId ? Number(saleId) : undefined,
        amount: parseFloat(totalAmount),
        date: saleDate ? saleDate.toISOString() : null,
        methodOfPayment: paymentMethod,
      };
      await axios.put(`${API_BASE_URL}/sales/${saleId}`, saleData);

      const productPromises = productList.map((item) => {
        if (item.isNew) {
          return axios.post(`${API_BASE_URL}/sales/${saleId}/products`, {
            saleId: saleId ? Number(saleId) : undefined,
            productId: item.id ? Number(item.id) : undefined,
            amount: item.sale_items.amount,
          });
        } else {
          return axios.put(`${API_BASE_URL}/sales/${saleId}/items/${item.id}`, {
            saleId: saleId ? Number(saleId) : undefined,
            productId: item.id ? Number(item.id) : undefined,
            amount: item.sale_items.amount,
          });
        }
      });

      const deletePromises = deletedProducts.map((item) =>
        axios.delete(`${API_BASE_URL}/sales/${saleId}/items/${item.id}`, {
          data: {
            saleId: saleId ? Number(saleId) : undefined,
            productId: item.id ? Number(item.id) : undefined,
          },
        })
      );

      await Promise.all([...productPromises, ...deletePromises]);

      alert("Venta actualizada con éxito");
      navigate(`/`);
    } catch (error) {
      setError("Error al actualizar la venta");
      console.error("Error:", error);
    }
  };

  return (
    <DarkPageContainer>
      <DarkContainer maxWidth="sm">
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Editar Venta
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: "#9e9e9e", fontFamily: "Montserrat" }}>
              Producto
            </InputLabel>
            <LightSelect
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              label="Producto"
              disabled={editingIndex !== null}
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
            inputProps={{ min: 1 }}
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            sx={{ mt: 2 }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          {editingIndex === null ? (
            <AccentButton onClick={addProduct} fullWidth>
              Agregar Producto
            </AccentButton>
          ) : (
            <AccentButton onClick={updateProduct} fullWidth>
              Actualizar Cantidad
            </AccentButton>
          )}
        </Box>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
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
                  primary={`${item.name} - Cantidad: ${item.sale_items.amount}`}
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

        <AccentButton onClick={saveSale} fullWidth sx={{ mt: 3 }}>
          Guardar Cambios
        </AccentButton>
      </DarkContainer>
    </DarkPageContainer>
  );
};

export default EditSale;
