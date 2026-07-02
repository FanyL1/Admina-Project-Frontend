'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Typography, Avatar, useMediaQuery, useTheme} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import StyleIcon from '@mui/icons-material/Style';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import GroupIcon from '@mui/icons-material/Group';
import TableRowsIcon from '@mui/icons-material/TableRows';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import DashboardIcon from '@mui/icons-material/Dashboard';

import { useLogin } from '../../../app/login/useLogin';
import Image from 'next/image';
import Link from 'next/link';
import { useGetAllUsers } from '@/app/(auth)/(management)/managementUser/usePage';

// Opciones según el rol
const getMenuItems = (role: string) => {
  const baseItems = [
    { label: 'Inicio', href: '/Inicio', icon: <DashboardIcon /> },
  ];

  const roleItems: Record<string, any[]> = {
    Estudiante: [
      { label: 'Solicitudes', href: '/request', icon: <SchoolIcon /> },
      { label: 'Mis Solicitudes', href: '/myRequest', icon: <TurnedInIcon /> },
    ],
    Administrativo: [
      { label: 'Gestión de Estudiantes', href: '/managementStudiants', icon: <GroupIcon /> },
      { label: 'Lista de Solicitudes', href: '/ListRequest', icon: <AdminPanelSettingsIcon /> },
      { label: 'Gestión de Tramites', href: '/managementType', icon: <TableRowsIcon /> },
      { label: 'Gestión de Categorias', href: '/managementCategory', icon: <StyleIcon /> },
      { label: 'Reportes', href: '/reports', icon: <TrackChangesIcon /> },
    ],
    Superusuario: [
      { label: 'Gestión de Usuarios', href: '/managementUser', icon: <AdminPanelSettingsIcon /> },
      { label: 'Gestión de Estudiantes', href: '/managementStudiants', icon: <GroupIcon /> },
      { label: 'Lista de Solicitudes', href: '/ListRequest', icon: <AdminPanelSettingsIcon /> },      
      //{ label: 'Gestión de Roles (Solo Para desarrollo)', href: '/role', icon: <AdminPanelSettingsIcon /> },
      { label: 'Gestión de Carreras', href: '/managementDegree', icon: <SquareFootIcon /> },
      { label: 'Gestión de Categorias', href: '/managementCategory', icon: <StyleIcon /> },
      { label: 'Gestión de Tramites', href: '/managementType', icon: <TableRowsIcon /> },
      { label: 'Estadisticas', href: '/statistics', icon: <EqualizerIcon /> },
      { label: 'Reportes', href: '/reports', icon: <TrackChangesIcon /> },

    ],
  };

  return [...baseItems, ...(roleItems[role] || [])];
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sessionUser, logout, isAuthenticated } = useLogin();
  const {users} = useGetAllUsers()
  
  const [open, setOpen] = useState(!isMobile);

  if (!isAuthenticated) return null;
  const userSession = users.find((u) => u.id === sessionUser?.id);

  const menuItems = getMenuItems(sessionUser?.role?.name || '');

  const itemsFiltrados = isMobile 
  ? menuItems.filter(item => item.label !== 'Estadisticas')
  : menuItems;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      {/* Header con logo y botón colapsar */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider' }}>
        {open && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Image src="/Log-A.svg" alt="Logo" width={32} height={32} />
           <Typography variant="h6">Admina</Typography>
        </Box>}
        {!isMobile && (
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Box>

      {/* Perfil del usuario */}
      {open && (
        <Link href="/profile" style={{ textDecoration: 'none' }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>{userSession?.name?.[0]}</Avatar>
            <Box>
              <Typography variant="body2" sx={{fontWeight:600}}>{userSession?.name} {userSession?.lastname}</Typography>
              <Typography variant="caption" color="textSecondary">{userSession?.role?.name}</Typography>
            </Box>
          </Box>
        </Link>
      )}

      {/* Menú */}
      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {itemsFiltrados.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5}}>
            <ListItemButton
              component={Link}
              href={item.href}
              selected={pathname === item.href}
              sx={{
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                borderRadius: 1,
                '&.Mui-selected': { bgcolor: 'primary.light', color: 'white' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.label} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Cerrar sesión */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1 }}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          {open && <ListItemText primary="Cerrar Sesión" />}
        </ListItemButton>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton 
          onClick={() => setOpen(true)} 
          sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1100 }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
          <Box sx={{ width: 280 }}>{sidebarContent}</Box>
        </Drawer>
      </>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 280 : 80,
        '& .MuiDrawer-paper': { width: open ? 280 : 80, transition: 'width 0.2s', boxSizing: 'border-box' },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
}