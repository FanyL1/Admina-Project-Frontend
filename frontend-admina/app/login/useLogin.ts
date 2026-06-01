"use client"
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { loginSchema } from "../../schemas/authSchem";
import { z } from "zod";
import { LoginData, Session } from "@/app/type";
import Cookies from 'js-cookie';

// Función para guardar la sesión en localStorage
const saveSession = (session: Session) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userSession', JSON.stringify(session));

    Cookies.set('userSession', JSON.stringify(session), { expires: 1 }); // 1 día
    Cookies.set('userRole', session.user?.role?.name || '', { expires: 1 });
    Cookies.set('userToken', session.token || '', { expires: 1 });
     
    if (session.token) {
      localStorage.setItem('authToken', session.token);
    }
  }
};

// Función para obtener la sesión
export const getSession = (): Session | null => {
  if (typeof window !== 'undefined') {
    
    const sessionCookie = Cookies.get('userSession');
    if (sessionCookie) {
      return JSON.parse(sessionCookie);
    }

    const session = localStorage.getItem('userSession');
    if (session) {
      return JSON.parse(session);
    }
  }
  return null;
};

// Función para remover la session
export const clearSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userSession');
    localStorage.removeItem('authToken');
    Cookies.remove('userSession');
    Cookies.remove('userRole');
    Cookies.remove('userToken');
  }
};

export const login = async (formData: LoginData): Promise<Session> => {
  let toastId: string | undefined;

  try {
   
    const validatedData = loginSchema.parse(formData);   
    toastId = toast.loading('Iniciando sesión...');
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: validatedData.email,
        pass: validatedData.pass,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al iniciar sesión');
      return {
        success: false,
        message: data.error || 'Error al iniciar sesión',
        details: data.details,
      };
    }

    const formattedDate = data.user.created_at 
      ? new Date(data.user.created_at).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : new Date().toISOString();

    const session: Session = {
      success: true,
      message: 'Login exitoso',
      token: data.token,
      expiresIn: data.expiresIn,
      user: {
        id: data.user.id,
        name: data.user.name,
        lastname: data.user.lastname,
        email: data.user.email,
        dni: data.user.dni,
        created_at: data.user.created_at || formattedDate, 
        status: data.user.status,
        role: data.user.role,
      },
    };

    saveSession(session);
    
    toast.dismiss(toastId);
    toast.success(`¡Bienvenido ${session.user?.name}!`);
    
    return session;

  } catch (error: any) {
    if (toastId) toast.dismiss(toastId);
    
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      const firstError = formattedErrors[0];
      toast.error(`${firstError.field}: ${firstError.message}`);
      
      return {
        success: false,
        message: 'Error de validación',
        details: formattedErrors,
      };
    }
    
    toast.error('Error de conexión con el servidor');
    
    return {
      success: false,
      message: 'Error de conexión con el servidor',
      details: [{ field: 'general', message: error.message }],
    };
  }
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; message: string }>>([]);
  const [session, setSession] = useState<Session | null>(null);

  // Cargar sesión al montar el componente
  useEffect(() => {
    const savedSession = getSession();
    if (savedSession) {
      setSession(savedSession);
    }
  }, []);

  const loginUser = async (formData: LoginData) => {
    setLoading(true);
    setError(null);
    setValidationErrors([]);
    
    try {
      loginSchema.parse(formData);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        setValidationErrors(formattedErrors);
        setError('Por favor, corrige los errores del formulario');
        setLoading(false);
        
        return {
          success: false,
          message: 'Error de validación',
          details: formattedErrors,
        };
      }
    }
    
    const result = await login(formData);
    
    if (result.success) {
      setSession(result);
    } else {
      setError(result.message);
      if (result.details) {
        setValidationErrors(result.details);
      }
    }
    
    setLoading(false);
    return result;
  };

  // Función para cerrar sesión
  const logout = () => {
    clearSession();
    setSession(null);
    toast.success('Sesión cerrada');
  };

  // Función para obtener la fecha de creación formateada
  const getUserCreatedAt = (format: 'full' | 'date' | 'datetime' = 'full') => {
    if (!session?.user?.created_at) return 'Fecha no disponible';
    
    const date = new Date(session.user.created_at);
    
    switch(format) {
      case 'date':
        return date.toLocaleDateString('es-ES');
      case 'datetime':
        return date.toLocaleString('es-ES');
      default:
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
    }
  };
  return { 
    loginUser, 
    logout,
    loading, 
    error, 
    validationErrors,
    session,
    isAuthenticated: session?.success,
    sessionUser: session?.user,
    token: session?.token,
    getUserCreatedAt,
  };
};