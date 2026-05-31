// app/signUp/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Paper, Typography, Box, Link } from '@mui/material';

import { useSignUp } from './useSingUp';
import { Buttons } from '@/components/UX/Buttons/buttons';
import Form from '../../components/UX/Form/formAcces';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/Shared/Navbar/navbar';
import theme from '@/app/theme';

export default function SignUpPage() {
  const router = useRouter();
  const { register, loading, validationErrors } = useSignUp();
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    dni: '',
    email: '',
    pass: '',
  });


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {  
  e.preventDefault()
  
  const result = await register(formData);
  
  if (result.success) {
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  }
  
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
  <Navbar />
  
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 64px)', // Restando altura del navbar
      p: { xs: 2, sm: 4, md: 6 },
    }}
  >
    <Toaster 
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#4caf50',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#f44336',
            secondary: '#fff',
          },
        },
      }}
    />
    
    <Paper
      elevation={3}
      sx={{
        maxWidth: 600,
        width: '100%',
        mx: 'auto',
        p: { xs: 4, sm: 5, md: 6 },
        borderRadius: 4,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.primary.main} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 1,
          }}
        >
          Bienvenido
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Regístrate para comenzar
        </Typography>
      </Box>

      <Form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
          <TextField
            name="name"
            label="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            placeholder='Juan Antonio'
            error={!!validationErrors.find(e => e.field === 'name')}  // Coloca el borde rojo
            helperText={validationErrors.find(e => e.field === 'name')?.message}  // Coloca el texto
          />
          
          <TextField
            name="lastname"
            label="Apellido"
            value={formData.lastname}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            placeholder='Perez Hernandez'
            error={!!validationErrors.find(e => e.field === 'lastname')}  // Coloca el borde rojo
            helperText={validationErrors.find(e => e.field === 'lastname')?.message}  // Coloca el texto
          />
        </Box>
        
        <TextField
          name="dni"
          label="Cedula"
          value={formData.dni}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          error={!!validationErrors.find(e => e.field === 'dni')}  // Coloca el borde rojo
          helperText={validationErrors.find(e => e.field === 'dni')?.message} // Coloca el texto
        />
        
        <TextField
          name="email"
          label="Correo electrónico"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          placeholder='ejemplo@gmail.com'
          sx={{ mb: 2 }}
          error={!!validationErrors.find(e => e.field === 'email')}  // Coloca el borde rojo
          helperText={validationErrors.find(e => e.field === 'email')?.message}  // Coloca el texto
        />
        
        <TextField
          name="pass"
          label="Contraseña"
          type="password"
          value={formData.pass}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          error={!!validationErrors.find(e => e.field === 'pass')}  // Coloca el borde rojo
          helperText={validationErrors.find(e => e.field === 'pass')?.message}  // Coloca el texto
        />
        <Box sx={{ textAlign: 'center'}}>
          <Typography variant="body2" color="text.secondary">
            Al registrarte aceptas los {' '}
            <Link
              href="/terms"
              sx={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Terminos y Condiciones.
            </Link>
          </Typography>
        </Box>
        <Buttons
          type="submit"
          variant="contained"
          disabled={loading}
          fullWidth
          size="large"
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
          }}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </Buttons>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              sx={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Inicia sesión aquí
            </Link>
          </Typography>
        </Box>
      </Form>
    </Paper>
  </Box>
</Box>
  );
}