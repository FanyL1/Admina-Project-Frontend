'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField,  Typography, Box, Link, Paper,} from '@mui/material';

import  Form  from '../../../components/UX/Form/formAcces';
import { authService } from './useLogin';
import { LoginData } from './type';
import { Buttons } from '@/components/UX/Buttons/buttons';
import { Navbar } from '@/components/Shared/Navbar/navbar';
import theme from '@/app/theme';
import { Toaster } from 'react-hot-toast';

const initialState: LoginData = {
    email: '',
    pass: '',
};

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginData>(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.email || !formData.pass) {
            setError('Por favor, completa todos los campos');
            setLoading(false);
            return;
        }

        const result = await authService.login(formData);

        if (result.success) {
            const userRole = result.user?.role?.name;
            if (userRole === 'admin' || userRole === 'Administrador') {
                router.push('/');
            } else {
                router.push('/');
            }
        } else {
            setError(result.message);
        }

        setLoading(false);
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
        position="top-right"
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
            />
            
            <TextField
              name="lastname"
              label="Apellido"
              value={formData.lastname}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
          </Box>
          
          <TextField
            name="dni"
            label="DNI"
            value={formData.dni}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
          />
          
          <TextField
            name="password"
            label="Contraseña"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            sx={{ mb: 3 }}
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