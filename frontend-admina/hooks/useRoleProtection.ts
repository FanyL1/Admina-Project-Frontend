// hooks/useRoleProtection.ts
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLogin } from '../app/login/useLogin';

// Definir qué rutas puede ver cada rol
const roleRoutes = {
  Estudiante: [
    '/profile',
    '/request',
    '/myRequest',
  ],
  Administrativo: [
    '/profile',
    '/ListRequest',
    '/managementRequest',
    '/managementStudiants',
    '/managementCategory',
    '/statistics',
    '/reports',
  ],
  Superusuario: [
    '/profile',
    '/managementUser',
    '/managementDegree',
    '/ListRequest',
    '/managementRequest',
    '/managementStudiants',
    '/managementCategory',
    '/statistics',
    '/reports'
  ]
};

// Rutas que no requieren protección (además de las públicas)
const publicRoutes = ['/', '/login', '/signup', '/not-found', '/unauthorized'];

export function useRoleProtection() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, sessionUser, loading } = useLogin();
   const isReady = !loading && sessionUser !== null;

  useEffect(() => {

    // Si está cargando, esperar
    if (loading || !isReady) {
      console.log('🛡️ Esperando datos de sesión...');
      return;
    }

    // Verificar si es ruta pública
    if (publicRoutes.includes(pathname)) {
      console.log('🛡️ Ruta pública, acceso permitido');
      return;
    }
    
    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
      console.log('🛡️ No autenticado, redirigiendo a login');
      router.push('/login');
      return;
    }

    const userRole = sessionUser?.role?.name;
    console.log('🛡️ Verificando acceso - Rol:', userRole);
    console.log('🛡️ Ruta actual:', pathname);

    // Si no tiene rol, redirigir a unauthorized
    if (!userRole) {
      console.log('🛡️ Usuario sin rol asignado');
      router.push('/unauthorized');
      return;
    }

    const allowedRoutes = roleRoutes[userRole as keyof typeof roleRoutes];
    
    if (!allowedRoutes) {
      console.log('🛡️ Rol no reconocido:', userRole);
      router.push('/unauthorized');
      return;
    }

    // Verificar si la ruta actual está permitida para este rol
    const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));

    if (!hasAccess) {
      console.log(`🛡️ Acceso denegado: ${userRole} no puede acceder a ${pathname}`);
      router.push('/unauthorized');
    } else {
      console.log(`🛡️ Acceso permitido: ${userRole} puede acceder a ${pathname}`);
    }
  }, [isAuthenticated, sessionUser, loading, router, pathname]);

  // Retornar información útil
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