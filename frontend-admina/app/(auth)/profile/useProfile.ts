'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useLogin } from '../../login/useLogin';
import { useGetAllUsers } from '../(management)/managementUser/usePage';

export interface ProfileFormData {
  name: string;
  lastname: string;
  dni: string;
  email: string;
  currentPass: string;
  newPass: string;
  confirmPass: string;
}

// Esquema de validación para el perfil
const profileSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede superar los 50 caracteres')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  
  lastname: z.string()
    .min(3, 'El apellido debe tener al menos 3 caracteres')
    .max(50, 'El apellido no puede superar los 50 caracteres')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El apellido solo puede contener letras y espacios'),
  dni: z.string()
    .max(8,"Cedula inválida")
    .regex(/^\d+$/, "Solo se permiten números"),
  email: z.string()
    .email('Correo electrónico inválido')
    .min(5, 'El email es demasiado corto')
    .max(100, 'El email es demasiado largo')
    .toLowerCase(),
  
  currentPass: z.string().optional(),
  newPass: z.string().optional(),
  confirmPass: z.string().optional(),
}).refine((data) => {
  // Si se está cambiando contraseña
  if (data.newPass || data.currentPass || data.confirmPass) {
    return !!data.currentPass;
  }
  return true;
}, {
  message: 'Debes ingresar tu contraseña actual para cambiar la contraseña',
  path: ['currentPass'],
}).refine((data) => {
  if (data.newPass || data.currentPass || data.confirmPass) {
    return !!data.newPass;
  }
  return true;
}, {
  message: 'Debes ingresar una nueva contraseña',
  path: ['newPass'],
}).refine((data) => {
  if (data.newPass || data.confirmPass) {
    return data.newPass === data.confirmPass;
  }
  return true;
}, {
  message: 'Las contraseñas nuevas no coinciden',
  path: ['confirmPass'],
}).refine((data) => {
  if (data.newPass) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/;
    return passwordRegex.test(data.newPass);
  }
  return true;
}, {
  message: 'La contraseña debe incluir una mayúscula, un número y un caracter especial',
  path: ['newPass'],
});

export const useProfile = () => {
  const { sessionUser, token, getUserCreatedAt } = useLogin();
  const { users} = useGetAllUsers()
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; message: string }>>([]);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    lastname: '',
    dni: '',
    email: '',
    currentPass: '',
    newPass: '',
    confirmPass: '',
  });

  const currentUser = users.find((u) => u.id === sessionUser?.id);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || '',
        lastname: currentUser.lastname || '',
        dni: currentUser.dni || '',
        email: currentUser.email || '',
      }));

    }
  }, [currentUser]);

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error de validación de ese campo cuando el usuario escribe
    setValidationErrors(prev => prev.filter(err => err.field !== field));
  };

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const updateProfile = async (id: string | undefined,  sessionUser: any): Promise<boolean> => {
    let toastId: string | undefined;
    
    try {
      // Validar con Zod
      const validatedData = profileSchema.parse({
        name: formData.name,
        lastname: formData.lastname,
        dni: formData.dni,
        email: formData.email,
        currentPass: formData.currentPass,
        newPass: formData.newPass,
        confirmPass: formData.confirmPass,
      });

      const body: Record<string, string> = {};

      if (validatedData.name !== sessionUser.name) {
        body.name = validatedData.name;
      }
      if (validatedData.lastname !== sessionUser.lastname) {
        body.lastname = validatedData.lastname;
      }
      if (validatedData.email !== sessionUser.email) {
        body.email = validatedData.email;
      }
      if (validatedData.dni !== sessionUser.dni) {
        body.dni = validatedData.dni;
      }

      // Si se está cambiando la contraseña
      if (validatedData.newPass) {
        body.currentPass = validatedData.currentPass!;
        body.pass = validatedData.newPass;
      }
            
      if (Object.keys(body).length === 0) {
        toast.error('No se realizaron cambios');
        return false;
      }

      toastId = toast.loading('Actualizando perfil...');
      setSaving(true);

      console.log('Body enviado al backend:', body);
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/update/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.dismiss(toastId);
        toast.error(data.error || 'Error al actualizar perfil');
        return false;
      }

      toast.dismiss(toastId);
      toast.success('Perfil actualizado exitosamente');
      
      // Limpiar campos de contraseña después de actualizar exitosamente
      setFormData(prev => ({
        ...prev,
        currentPass: '',
        newPass: '',
        confirmPass: '',
      }));
      
      return true;
      
    } catch (error) {
      if (toastId) toast.dismiss(toastId);

      if (error instanceof z.ZodError) {
        // Formatear errores de Zod para los inputs
        const formattedErrors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        setValidationErrors(formattedErrors);
      }

      return false;
    } finally {
      setSaving(false);
    }
  };

  // Función para obtener errores de un campo específico (para usar en los TextField)
  const getFieldError = (field: string) => {
    return validationErrors.find(err => err.field === field)?.message;
  };

  return {
    sessionUser,
    formData,
    loading,
    saving,
    showPasswords,
    validationErrors,
    getUserCreatedAt,
    handleChange,
    updateProfile,
    toggleShowPassword,
    getFieldError, // Exportar esta función helper
  };
};