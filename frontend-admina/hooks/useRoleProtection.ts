// hooks/useRoleProtection.ts
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLogin } from '../app/login/useLogin';

// Rutas por cada rol
const roleRoutes = {
  Estudiante: [ '/profile','/request', '/myRequest', ],
  Administrativo: ['/profile', '/ListRequest', '/managementRequest', '/managementStudiants', '/managementCategory', '/statistics', '/reports', ],
  Superusuario: [ '/profile', '/managementUser', '/managementDegree', '/ListRequest', '/managementRequest', '/managementStudiants', '/managementCategory', '/statistics', '/reports' ]
};

// Rutas que no requieren protección (además de las públicas). La ruta /unauthorized debe ser cambiada por un toast o aviso en los casso donde no se intenta acceder por url
const publicRoutes = ['/', '/login', '/signup', '/not-found', '/unauthorized'];

export function useRoleProtection() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, sessionUser, loading } = useLogin();
   const isReady = !loading && sessionUser !== null;

  useEffect(() => {

    // Si está cargando, esperar
    if (loading || !isReady) {
      return;
    }

    // Verificar si es ruta pública
    if (publicRoutes.includes(pathname)) {
      return;
    }

    // Verificar si esta autenticado
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const userRole = sessionUser?.role?.name;
    if (!userRole) {
      router.push('/unauthorized');
      return;
    }

    const allowedRoutes = roleRoutes[userRole as keyof typeof roleRoutes];
    
    if (!allowedRoutes) {
      router.push('/unauthorized');
      return;
    }

    // Verificar si la ruta actual está permitida para este rol
    const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));

    if (!hasAccess) {
      router.push('/unauthorized');
    } 
  }, [isAuthenticated, sessionUser, loading, router, pathname]);

  return {
    userRole: sessionUser?.role?.name,
    isAuthorized: isAuthenticated,
    loading,
    hasAccess: (route: string) => {
      const userRole = sessionUser?.role?.name;
      if (!userRole) return false;
      const allowedRoutes = roleRoutes[userRole as keyof typeof roleRoutes];
      return allowedRoutes?.some(r => route.startsWith(r)) || false;
    }
  };
}