"use client"
import { useState } from "react";
import toast from 'react-hot-toast';

export interface SignUpData {
  name: string;
  lastname: string;
  dni: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  data?: any;
  details?: Array<{ field: string; message: string }>;
}

export const signUp = async (formData: SignUpData): Promise<SignUpResponse> => {
  let toastId: string | undefined;

  try {
    // Mostrar toast de carga
    toastId = toast.loading('Registrando usuario...');
    console.log(formData);
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        lastname: formData.lastname,
        dni: formData.dni,
        email: formData.email,
        pass: formData.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Error del servidor
      toast.dismiss(toastId);
      toast.error(data.error || 'Error en el registro');
      return {
        success: false,
        message: data.error || 'Error en el registro',
        details: data.details,
        data: data,
      };
    }

    // Éxito
    toast.dismiss(toastId);
    toast.success('¡Usuario registrado exitosamente!');
    
    return {
      success: true,
      message: 'Usuario registrado exitosamente',
      data: data,
    };

  } catch (error: any) {
    // Error de conexión
    if (toastId) toast.dismiss(toastId);
    toast.error('Error de conexión con el servidor');
    
    return {
      success: false,
      message: 'Error de conexión con el servidor',
      details: [{ field: 'general', message: error.message }],
    };
  }
};

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (formData: SignUpData) => {
    setLoading(true);
    setError(null);
    
    const result = await signUp(formData);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
    return result;
  };

  return { register, loading, error };
};