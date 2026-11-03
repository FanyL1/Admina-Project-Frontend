'use client'
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Container,
} from '@mui/material';
import Image from 'next/image';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';


import { Buttons } from '../../UX/Buttons/buttons';


 export const Navbar: React.FC<{ onNavClick?: (sectionId: string) => void }> = ({ onNavClick }) => {  const theme = useTheme();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // usePathname puede devolver "/login/" por trailingSlash; se normaliza.
  const currentPath = (usePathname() || '/').replace(/\/+$/, '') || '/';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

   const menuItems = [
    { label: 'Inicio', sectionId: 'home' },
    { label: 'Servicios', sectionId: 'services' },
    { label: 'Acerca de', sectionId: 'about' },
    { label: 'Contacto', sectionId: 'contact' }
  ];

  const handleNavClick = (sectionId: string) => {
    if (onNavClick) {
      onNavClick(sectionId); 
    }
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 230, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      { currentPath == '/' && (<List> 
        {menuItems.map((item) => (
          <ListItem 
            key={item.label} 
            sx={{ pb: 0, border: 'none', background: 'none'}}
            onClick={() => handleNavClick(item.sectionId)}
            component="button"
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <Divider sx={{ my: 2 }} />
        <ListItem sx={{ flexDirection: 'column', gap: 1, mt: 2 }}>
          <Buttons
            variantType="primary"
            fullWidth
            href="/login"
          >
            Iniciar Sesión
          </Buttons>
          <Buttons
            variantType="tertiary"
            fullWidth
            href="/signUp"
          >
            Registrarse
          </Buttons>
        </ListItem>
      </List>)}
      { currentPath !== '/' && (<List> 
        {menuItems.map((item) => (
          <ListItem 
            key={item.label} 
            sx={{ pb: 0, border: 'none', background: 'none'}}
            onClick={() => router.push('/') }
            component="button"
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <Divider sx={{ my: 2 }} />
        <ListItem sx={{ flexDirection: 'column', gap: 1, mt: 2 }}>
          { currentPath !== '/login'  && (<Buttons
            variantType="primary"
            fullWidth
            href="/login"
          >
            Iniciar Sesión
          </Buttons>)}
          {currentPath !== '/signUp' && (<Buttons
            variantType="tertiary"
            fullWidth
            href="/signUp"
          >
            Registrarse
          </Buttons>)}
        </ListItem>
      </List>)}
    </Box>
  );

  return (
    <AppBar 
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${theme.palette.secondary.main}`,
        top: 0,
        zIndex: 1100,
        pt: 'var(--safe-top)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 }, py: 1 }}>
          {/* Logo izquierdo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer'  }}
           onClick={() => handleNavClick('home')}>
            <Image
              src="/Log-Admina.svg"
              alt="Logo"
              height={40}
              width={100}
              style={{ objectFit: 'contain' }}
            />
          </Box>

          {/* Menú Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {currentPath == '/' && (<Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Box
                  key={item.label}
                  component="button"
                  onClick={() => handleNavClick(item.sectionId)}
                  sx={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    color: theme.palette.text.primary,
                    '&:hover': { color: theme.palette.primary.main },
                    transition: 'color 0.3s ease',
                  }}
                >
                  {item.label}
                </Box>
              ))}
            </Box>)}
            {currentPath !== '/' && (<Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Box
                  key={item.label}
                  component="button"
                  onClick={() => router.push('/')}
                  sx={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    color: theme.palette.text.primary,
                    '&:hover': { color: theme.palette.primary.main },
                    transition: 'color 0.3s ease',
                  }}
                >
                  {item.label}
                </Box>
              ))}
            </Box>)}
           </Box>

          {/* Botones Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {currentPath !== '/login' && (<Buttons variantType="tertiary" href="/login">
              Iniciar Sesión
            </Buttons>)}
            {currentPath !== '/signUp' && (<Buttons variantType="primary" href="/signUp">
              Registrarse
            </Buttons>)}
          </Box>

          {/* Botón menú mobile */}
          <IconButton onClick={handleDrawerToggle} sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
            <MenuIcon />
          </IconButton>

          {/* Drawer Mobile */}
          <Drawer
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
          >
            {drawer}
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
};