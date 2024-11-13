import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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
import API_BASE_URL from "../config";
import { LocationContext } from "../context/LocationContext";
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

const NewLocation = () => {
  const { addLocation } = useContext(LocationContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      console.log("ID de la URL:", id);
      setIsEditing(true);
      axios
        .get(`${API_BASE_URL}/locations/${id}`)
        .then((response) => {
          setCity(response.data.city);
          setProvince(response.data.province);
        })
        .catch((error) => {
          console.error("Error al obtener la localidad:", error);
          setError("No se pudo cargar la localidad para editar");
        });
    }
  }, [id]);

  const validateInput = (value) => /^[A-Za-zÀ-ÿ\s]+$/.test(value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateInput(city) || !validateInput(province)) {
      setValidationError("Los campos solo pueden contener letras y espacios.");
      return;
    }

    const locationData = {
      id: id ? Number(id) : undefined,
      city: city.trim(),
      province: province.trim(),
    };

    if (isEditing) {
      axios
        .put(`${API_BASE_URL}/locations/${id}`, locationData)
        .then((response) => {
          alert("Localidad actualizada exitosamente");
          navigate("/");
        })
        .catch((error) => {
          console.error("Error al actualizar la localidad:", error);
          setError("Error al actualizar la localidad");
        });
    } else {
      axios
        .post(`${API_BASE_URL}/locations`, locationData)
        .then((response) => {
          addLocation(response.data);
          alert("Localidad creada exitosamente");
          navigate('/new-location');
        setCity("");
        setProvince("");
        })
        .catch((error) => {
          console.error("Error al crear la localidad:", error);
          setError("Error al crear la localidad");
        });

        
        
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
          {isEditing ? "Editar Localidad" : "Nueva Localidad"}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {validationError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {validationError}
          </Alert>
        )}
        <DarkCard>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <CustomTextField
                  label="Ciudad"
                  fullWidth
                  required
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setValidationError(
                      validateInput(e.target.value)
                        ? ""
                        : "Solo letras y espacios permitidos."
                    );
                  }}
                />
              </Box>
              <Box mb={2}>
                <CustomTextField
                  label="Provincia"
                  fullWidth
                  required
                  value={province}
                  onChange={(e) => {
                    setProvince(e.target.value);
                    setValidationError(
                      validateInput(e.target.value)
                        ? ""
                        : "Solo letras y espacios permitidos."
                    );
                  }}
                />
              </Box>
              <AccentButton
                variant="contained"
                type="submit"
                fullWidth
                sx={{ mt: 3 }}
              >
                {isEditing ? "Actualizar Localidad" : "Crear Localidad"}
              </AccentButton>
            </form>
          </CardContent>
        </DarkCard>
      </DarkContainer>
    </DarkPageContainer>
  );
};

export default NewLocation;
