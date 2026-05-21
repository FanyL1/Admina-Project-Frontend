/*
ESTO ES UN PROTOTIPO DESARROLLADO PARA PROBAR LA CONEXION CON EL BACKEND.
SE PUEDE TOMAR COMO EJEMPLO DE UTILIZAR MATERIAL UI PERO NO ES UN PRODUCTO FINAL
*/


'use client';
import { useState } from 'react';
import {Container, Box, Paper, TextField, Button, Typography, Alert, CircularProgress,} from '@mui/material';
import {PersonAdd,} from '@mui/icons-material';
import {signUp, SignUpData} from './useSingUp'

export default function RegisterPage() {
  const [formData, setFormData] = useState<SignUpData>({
    name: '',
    lastname: '',
    dni: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    success: boolean;
    message: string;
    details?: Array<{ field: string; message: string }>;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (response) setResponse(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const result = await signUp(formData);
    setResponse(result);

    if (result.success) {
      setFormData({
        name: '',
        lastname: '',
        dni: '',
        email: '',
        password: '',
      });
    }

    setLoading(false);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5 },
          width: '100%',
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              borderRadius: '50%',
              p: 1.5,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PersonAdd sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Crear Cuenta
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mt: 1,
            }}
          >
            Completa tus datos para registrarte
          </Typography>
        </Box>

        {/* Alertas */}
        {response && (
          <Alert
            severity={response.success ? 'success' : 'error'}
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setResponse(null)}
          >
            <Typography variant="body2" sx={{fontSize:20}}>
              {response.message}
            </Typography>
            {response.details && response.details.length > 0 && (
              <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                {response.details.map((err, idx) => (
                  <li key={idx}>
                    <Typography variant="caption">
                      {err.field}: {err.message}
                    </Typography>
                  </li>
                ))}
              </Box>
            )}
          </Alert>
        )}

        {/* Formulario */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            required
            name="name"
            label="Nombre"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            sx={{ mb: 3 }}
            helperText="Introduzca sus dos nombre"
          />

          <TextField
            fullWidth
            required
            name="lastname"
            label="Apellido"
            value={formData.lastname}
            onChange={handleChange}
            disabled={loading}
            sx={{ mb: 3 }}
            helperText="Introduzca sus dos apellidos"
          />

          <TextField
            fullWidth
            required
            name="dni"
            label="DNI"
            value={formData.dni}
            onChange={handleChange}
            disabled={loading}
            placeholder="12345678"
            helperText="Solo números"
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            required
            name="email"
            type="email"
            label="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            required
            name="password"
            type={'password'}
            label="Contraseña"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            sx={{ mb: 4 }}
            helperText="Mínimo 8 caracteres, una mayúscula, un número y un carácter especial"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              mb: 2,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
          </Button>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 0.5,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              ¿Ya tienes una cuenta?
            </Typography>
            <Button
              variant="text"
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                p: 0,
                minWidth: 'auto',
              }}
              onClick={() => {
                window.location.href = '/login';
              }}
            >
              Iniciar sesión
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}