"use client"
import { useState } from "react";
import toast from 'react-hot-toast';
import { registerSchema } from "../../schemas/authSchem"; // Esquema para errores
import { z } from "zod"; // Asegúrate de importar Zod sino no funionan las validaciones
import { SignUpData, SignUpResponse } from "@/app/type"; // Le especifica a Typesript que tipo de datos esperar


export const signUp = async (formData: SignUpData): Promise<SignUpResponse> => {
  let toastId: string | undefined;

  try {

    const validatedData = registerSchema.parse(formData);
    toastId = toast.loading('Registrando usuario...');
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: validatedData.name,   
        lastname: validatedData.lastname,
        dni: validatedData.dni,
        email: validatedData.email,
        pass: validatedData.pass,  
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error en el registro');
      return {
        success: false,
        message: data.error || 'Error en el registro',
        details: data.details,
        data: data,
      };
    }

    toast.dismiss(toastId);
    toast.success('¡Usuario registrado exitosamente!');
    
    return {
      success: true,
      message: 'Usuario registrado exitosamente',
      data: data,
    };

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

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; message: string }>>([]); // Estado para errores de validación

  const register = async (formData: SignUpData) => {
    setLoading(true);
    setError(null);
    setValidationErrors([]); 
    
     try {

       registerSchema.parse(formData);

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
    

    const result = await signUp(formData);
    
    if (!result.success) {
      setError(result.message);
      if (result.details) {
        setValidationErrors(result.details);
      }
    }
    
    setLoading(false);
    return result;
  };

  return { register, loading, error, validationErrors }; 
};