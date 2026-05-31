// app/(authenticated)/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Sidebar from '@/components/Shared/Navbar/Sidebar';
import { useLogin } from '../login/useLogin';
import { useRouter } from 'next/navigation';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const router = useRouter();
  const { isAuthenticated, loading, session } = useLogin();
  const [isClient, setIsClient] = useState(false);
  const [verificado, setVerificado] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {

    if (!isClient || loading) return;
    
    console.log('🔍 Verificando sesión:', {
      isAuthenticated,
      hasSession: !!session,
      hasUser: !!session?.user,
      role: session?.user?.role?.name
    });
    
    // Si no está autenticado, redirigir
    if (!isAuthenticated || !session?.user) {
      console.log('No autenticado, redirigiendo a login');
      router.push('/login');
      return;
    }
    
    setVerificado(true);
  }, [isAuthenticated, loading, router, isClient, session]);

  // Mostrar loading
  if (!isClient || loading || !verificado) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h3" sx={{ 
          fontSize: { xs: '0.5rem', sm: '1rem', md: '1.5rem' }, 
          fontWeight: 800, 
          background: `linear-gradient(90deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`, 
          backgroundClip: 'text', 
          WebkitBackgroundClip: 'text', 
          color: 'transparent' 
        }}>
          Cargando...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        {children}
      </Box>
    </Box>
  );
}