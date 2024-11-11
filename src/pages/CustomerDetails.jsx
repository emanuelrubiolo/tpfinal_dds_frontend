import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CustomerContext } from "../context/CustomerContext";
import API_BASE_URL from "../config";
import "@fontsource/montserrat";
import EditIcon from "@mui/icons-material/Edit";

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

const DarkCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#1b1e28",
  color: "#e0e0e3",
  padding: theme.spacing(4),
  borderRadius: "24px",
  boxShadow: "0px 6px 24px rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(10px)",
}));

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

const DeleteButton = styled(Button)({
  backgroundColor: "#f44336",
  color: "#fff",
  padding: "8px 16px",
  fontSize: "0.875rem",
  fontWeight: "bold",
  borderRadius: "50px",
  fontFamily: "Montserrat",
  boxShadow: "0px 4px 15px rgba(244, 67, 54, 0.4)",
  "&:hover": {
    backgroundColor: "#d32f2f",
    boxShadow: "0px 6px 20px rgba(244, 67, 54, 0.6)",
  },
});

const EditButton = styled(Button)({
  backgroundColor: "#4caf50",
  color: "#fff",
  padding: "8px 16px",
  fontSize: "0.875rem",
  fontWeight: "bold",
  borderRadius: "50px",
  fontFamily: "Montserrat",
  boxShadow: "0px 4px 15px rgba(76, 175, 80, 0.4)",
  marginRight: "8px",
  "&:hover": {
    backgroundColor: "#66bb6a",
    boxShadow: "0px 6px 20px rgba(76, 175, 80, 0.6)",
  },
});

const CustomerDetails = () => {
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    saleId: null,
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCustomer, selectCustomer } = useContext(CustomerContext);
  const [sales, setSales] = useState([]);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [hasFetchedCustomer, setHasFetchedCustomer] = useState(false);
  const [hasFetchedSales, setHasFetchedSales] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (
        !hasFetchedCustomer &&
        (!selectedCustomer || selectedCustomer.id !== id)
      ) {
        try {
          setLoadingCustomer(true);
          const customerResponse = await axios.get(
            `${API_BASE_URL}/customers/${id}`
          );
          selectCustomer(customerResponse.data);
          setHasFetchedCustomer(true);
        } catch (err) {
          setError("Error al obtener los detalles del cliente");
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
    const fetchSalesData = async () => {
      try {
        setLoadingSales(true);
        const salesResponse = await axios.get(
          `${API_BASE_URL}/customers/${id}/sales`
        );
        const salesWithDetails = await Promise.all(
          salesResponse.data.map(async (sale) => {
            const productsResponse = await axios.get(
              `${API_BASE_URL}/sales/${sale.id}/products`
            );
            const saleDataResponse = await axios.get(`${API_BASE_URL}/sales`);

            const saleAmount =
              saleDataResponse.data.find((s) => s.id === sale.id)?.amount || 0;

            return {
              id: sale.id,
              date: sale.date,
              totalAmount: saleAmount,
              products: productsResponse.data.map((product) => ({
                id: product.id,
                name: product.name,
                amount: product.sale_items.amount,
              })),
            };
          })
        );
        setSales(salesWithDetails);
        setHasFetchedSales(true);
      } catch (err) {
        setError("Error al obtener los datos de las ventas");
        console.error(err);
      } finally {
        setLoadingSales(false);
      }
    };

    fetchSalesData();
  }, [id, hasFetchedSales]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const locationsResponse = await axios.get(`${API_BASE_URL}/locations`);
        setLocations(locationsResponse.data);
      } catch (err) {
        setError("Error al obtener las ubicaciones");
        console.error(err);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  const handleAddSale = () => {
    navigate(`/customers/${id}/new-sale`);
  };

  const handleDeleteSale = async (saleId) => {
    try {
      await axios.delete(`${API_BASE_URL}/sales/${saleId}`);
      setSales((prevSales) => prevSales.filter((sale) => sale.id !== saleId));
    } catch (err) {
      setError("Error al eliminar la venta");
      console.error(err);
    }
  };

  const handleEditSale = (saleId) => {
    navigate(`/customers/${id}/edit-sale/${saleId}`);
  };

  const getLocationName = (locationId) => {
    const location = locations.find((loc) => loc.id === locationId);
    return location
      ? `${location.city}, ${location.province}`
      : "No disponible";
  };

  if (loadingCustomer || loadingSales || loadingLocations)
    return <CircularProgress color="primary" />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <DarkPageContainer>
      <DarkContainer maxWidth="md">
        <Typography
          variant="h4"
          color="primary"
          gutterBottom
          sx={{ fontFamily: "Montserrat", fontWeight: "bold" }}
        >
          Detalles del Cliente
        </Typography>
        {selectedCustomer ? (
          <DarkCard sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5">
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
                <strong>Localidad:</strong>{" "}
                {getLocationName(selectedCustomer.locationId)}
              </Typography>
              <AccentButton onClick={handleAddSale} sx={{ mt: 2 }}>
                Agregar Venta
              </AccentButton>
            </CardContent>
          </DarkCard>
        ) : (
          <Typography variant="body1">
            No se encontraron detalles del cliente.
          </Typography>
        )}
        {sales.length === 0 ? (
          <Typography variant="body1">
            No se encontraron ventas para este cliente.
          </Typography>
        ) : (
          <List>
            {sales.map((sale) => (
              <ListItem
                key={sale.id}
                sx={{
                  backgroundColor: "#333842",
                  mb: 3,
                  p: 3,
                  borderRadius: 3,
                  color: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#ff79b0",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    mb: 1,
                  }}
                >
                  ID de Venta: {sale.id}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#b0b3c6", mb: 2, fontSize: "1rem" }}
                >
                  Fecha: {new Date(sale.date).toLocaleDateString()}
                </Typography>
                <Box sx={{ ml: 2, mb: 2, width: "100%" }}>
                  {sale.products.map((product) => (
                    <Box
                      key={product.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: "#2b2f39",
                        p: 2,
                        borderRadius: 2,
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ color: "#ff9e9e", fontSize: "1rem" }}
                      >
                        Producto: {product.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "#b0b3c6", fontSize: "1rem" }}
                      >
                        Cantidad: {product.amount}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#ffd700",
                    fontSize: "1.2rem",
                    alignSelf: "flex-end",
                  }}
                >
                  Total: ${sale.totalAmount}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <EditButton
                    onClick={() => handleEditSale(sale.id)}
                    startIcon={<EditIcon />}
                  >
                    Editar Venta
                  </EditButton>

                  <DeleteButton
                    onClick={() =>
                      setDeleteDialog({ open: true, saleId: sale.id })
                    }
                  >
                    Eliminar Venta
                  </DeleteButton>

                  <Dialog
                    open={deleteDialog.open}
                    onClose={() =>
                      setDeleteDialog({ open: false, saleId: null })
                    }
                  >
                    <DialogTitle>Confirmar Eliminación</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Confirmar eliminacion de la venta?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() =>
                          setDeleteDialog({ open: false, saleId: null })
                        }
                        color="primary"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => handleDeleteSale(sale.id)}
                        color="error"
                      >
                        Eliminar
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </DarkContainer>
    </DarkPageContainer>
  );
};

export default CustomerDetails;
