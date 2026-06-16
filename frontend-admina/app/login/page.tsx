'use client';
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField,  Typography, Box, Link, Paper,} from '@mui/material';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import  Form  from '../../components/UX/Form/formAcces';
import { useLogin } from './useLogin';
import { LoginData } from '../type';
import { Buttons } from '@/components/UX/Buttons/buttons';
import { Navbar } from '@/components/Shared/Navbar/navbar';
import theme from '@/app/theme';
import AppToaster from '@/components/UX/Toaster/AppToaster';

const initialState: LoginData = {
    email: '',
    pass: '',
};

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginData>(initialState);
    const [showPassword, setShowPassword] = React.useState(false);
    const { loginUser, loading, validationErrors} = useLogin()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {  
    e.preventDefault()
    
    const result = await loginUser(formData);
    
    //Despues de 1s redirigue, esto es para que se vea el toast
    if (result.success) {
      setTimeout(() => {
        router.push('/Inicio');
      }, 1000);
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
      <AppToaster />
      
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
            Iniciar Sesión
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ingresa tus datos para continuar
          </Typography>
        </Box>

        <Form onSubmit={handleSubmit}>
          
          <TextField
            name="email"
            label="Correo electrónico"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            error={!!validationErrors.find(e => e.field === 'email')}  // Coloca el borde rojo
            helperText={validationErrors.find(e => e.field === 'email')?.message}  // Coloca el texto
          />
          
          <TextField
            name="pass"
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            value={formData.pass}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            sx={{ mb: 3 }}
            error={!!validationErrors.find(e => e.field === 'pass')}  // Coloca el borde rojo
            helperText={validationErrors.find(e => e.field === 'pass')?.message}  // Coloca el texto
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          
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
              fontWeight: 600,
            }}
          >
            {loading ? 'Iniciando Sessión...' : 'Iniciar Sessión'}
          </Buttons>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              ¿No tienes cuenta?{' '}
              <Link
                href="/signUp"
                sx={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Registrate aquí
              </Link>
            </Typography>
          </Box>
        </Form>
      </Paper>
    </Box>
  </Box>
    );
}
