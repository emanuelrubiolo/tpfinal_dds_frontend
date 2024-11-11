import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import API_BASE_URL from "../config";
import { CustomerContext } from "../context/CustomerContext";
import "@fontsource/montserrat";

const DarkPageContainer = styled("div")({
  minHeight: "100vh",
  backgroundColor: "#121212",
  padding: "40px 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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

const DarkContainer = styled(Container)({
  background: "linear-gradient(145deg, #1b1e28, #23262f)",
  padding: "30px",
  borderRadius: "32px",
  boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.4)",
  color: "#fff",
  fontFamily: "Montserrat",
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

const NewCustomer = () => {
  const { addCustomer, updateCustomer } = useContext(CustomerContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/locations`)
      .then((response) => setLocations(response.data))
      .catch((error) => {
        console.error("Error al cargar las localidades:", error);
        setError("Error al cargar las localidades");
      });

    if (id) {
      axios
        .get(`${API_BASE_URL}/customers/${id}`)
        .then((response) => {
          const { name, lastName, phone, comment, locationId } = response.data;
          setName(name || "");
          setLastName(lastName || "");
          setPhone(phone || "");
          setComment(comment || "");
          setLocationId(locationId || "");
        })
        .catch((error) => {
          console.error("Error al cargar los datos del cliente:", error);
          setError("Error al cargar los datos del cliente");
        });
    }
  }, [id]);

  const isValidName = (value) => /^[a-zA-ZÀ-ÿ\s]*$/.test(value);
  const isValidPhone = (value) => /^\d*$/.test(value);

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (isValidName(value)) {
      setName(value);
      setValidationErrors((prev) => ({ ...prev, name: "" }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        name: "Solo se permiten letras y espacios.",
      }));
    }
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    if (isValidName(value)) {
      setLastName(value);
      setValidationErrors((prev) => ({ ...prev, lastName: "" }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        lastName: "Solo se permiten letras y espacios.",
      }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (isValidPhone(value)) {
      setPhone(value);
      setValidationErrors((prev) => ({ ...prev, phone: "" }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        phone: "Solo se permiten números.",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let errors = {};
    if (name.trim().length < 3) {
      errors.name = "El nombre debe tener al menos 3 caracteres.";
    }
    if (lastName.trim().length < 3) {
      errors.lastName = "El apellido debe tener al menos 3 caracteres.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const customerData = {
      id: id ? Number(id) : undefined,
      name: name.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() === "" ? null : phone,
      comment: comment.trim() === "" ? null : comment,
      locationId: locationId || null,
    };

    const request = id
      ? axios.put(`${API_BASE_URL}/customers/${id}`, customerData)
      : axios.post(`${API_BASE_URL}/customers`, customerData);

    request
      .then((response) => {
        id ? updateCustomer(customerData) : addCustomer(response.data);
        alert(`Cliente ${id ? "actualizado" : "creado"} exitosamente`);
        navigate("/");
      })
      .catch((error) => {
        console.error(
          `Error al ${id ? "actualizar" : "crear"} el cliente:`,
          error
        );
        setError(`Error al ${id ? "actualizar" : "crear"} el cliente`);
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
          {id ? "Editar Cliente" : "Nuevo Cliente"}
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
                  onChange={handleNameChange}
                  error={Boolean(validationErrors.name)}
                  helperText={validationErrors.name}
                />
              </Box>
              <Box mb={2}>
                <CustomTextField
                  label="Apellido"
                  fullWidth
                  required
                  value={lastName}
                  onChange={handleLastNameChange}
                  error={Boolean(validationErrors.lastName)}
                  helperText={validationErrors.lastName}
                />
              </Box>
              <Box mb={2}>
                <CustomTextField
                  label="Teléfono"
                  fullWidth
                  value={phone}
                  onChange={handlePhoneChange}
                  error={Boolean(validationErrors.phone)}
                  helperText={validationErrors.phone}
                />
              </Box>
              <Box mb={2}>
                <CustomTextField
                  label="Comentario"
                  multiline
                  rows={3}
                  fullWidth
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Box>
              <Box mb={2}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{ color: "#9e9e9e", fontFamily: "Montserrat" }}
                  >
                    Localidad
                  </InputLabel>
                  <Select
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    label="Localidad"
                    required
                    sx={{ color: "#e0e0e3", fontFamily: "Montserrat" }}
                  >
                    {locations.map((location) => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.city} - {location.province}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <AccentButton
                variant="contained"
                type="submit"
                fullWidth
                sx={{ mt: 3 }}
              >
                {id ? "Guardar Cambios" : "Crear Cliente"}
              </AccentButton>
            </form>
          </CardContent>
        </DarkCard>
      </DarkContainer>
    </DarkPageContainer>
  );
};

export default NewCustomer;
