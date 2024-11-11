import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ProductContext } from "../context/ProductContext";
import API_BASE_URL from "../config";
import "@fontsource/montserrat";

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

const NewProduct = () => {
  const { addProduct } = useContext(ProductContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      axios
        .get(`${API_BASE_URL}/products/${id}`)
        .then((response) => {
          const { name, category, description } = response.data;
          setName(name);
          setCategory(category);
          setDescription(description);
        })
        .catch((error) => {
          console.error("Error al cargar el producto:", error);
          setError("Error al cargar el producto");
        });
    }
  }, [id]);

  const validateName = (value) => /^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/.test(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateName(name)) {
      setError(
        "El nombre solo puede contener letras, números y espacios entre palabras."
      );
      return;
    }

    const productData = {
      id: id ? Number(id) : undefined,
      name: name.trim(),
      category: (category || "").trim() === "" ? null : category.trim(),
      description:
        (description || "").trim() === "" ? null : description.trim(),
    };

    const request = isEditing
      ? axios.put(`${API_BASE_URL}/products/${id}`, productData)
      : axios.post(`${API_BASE_URL}/products`, productData);

    request
      .then((response) => {
        if (!isEditing) addProduct(response.data);
        alert(`Producto ${isEditing ? "actualizado" : "creado"} exitosamente`);
        navigate("/");
      })
      .catch((error) => {
        console.error(
          `Error al ${isEditing ? "actualizar" : "crear"} el producto:`,
          error
        );
        setError(`Error al ${isEditing ? "actualizar" : "crear"} el producto`);
      });
  };

  return (
    <DarkPageContainer>
      <DarkContainer maxWidth="sm">
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontFamily: "Montserrat", fontWeight: "bold" }}
        >
          {isEditing ? "Editar Producto" : "Nuevo Producto"}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <DarkCard>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <CustomTextField
                  label="Nombre"
                  fullWidth
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>
              <Box mb={2}>
                <CustomTextField
                  label="Categoría"
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Box>
              <Box mb={2}>
                <CustomTextField
                  label="Descripción"
                  multiline
                  rows={3}
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Box>
              <AccentButton
                variant="contained"
                type="submit"
                fullWidth
                sx={{ mt: 3 }}
              >
                {isEditing ? "Guardar Cambios" : "Crear Producto"}
              </AccentButton>
            </form>
          </CardContent>
        </DarkCard>
      </DarkContainer>
    </DarkPageContainer>
  );
};

export default NewProduct;
