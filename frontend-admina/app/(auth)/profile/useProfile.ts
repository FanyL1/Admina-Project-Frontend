'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLogin } from '../../login/useLogin';
import { z } from 'zod';

export interface ProfileFormData {
  name: string;
  lastname: string;
  email: string;
  currentPass: string;
  newPass: string;
  confirmPass: string;
}

export const useProfile = () => {
  const { sessionUser, token, getUserCreatedAt } = useLogin();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    lastname: '',
    email: '',
    currentPass: '',
    newPass: '',
    confirmPass: '',
  });

  useEffect(() => {
    if (sessionUser) {
      setFormData((prev) => ({
        ...prev,
        name: sessionUser.name || '',
        lastname: sessionUser.lastname || '',
        email: sessionUser.email || '',
      }));
    }
  }, [sessionUser]);

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const updateProfile = async (): Promise<boolean> => {
    let toastId: string | undefined;

    try {
      const body: Record<string, string> = {};

      body.name = z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(50, 'El nombre no puede superar los 50 caracteres')
        .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
        .parse(formData.name);

      body.lastname = z.string()
        .min(3, 'El apellido debe tener al menos 3 caracteres')
        .max(50, 'El apellido no puede superar los 50 caracteres')
        .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El apellido solo puede contener letras y espacios')
        .parse(formData.lastname);

      body.email = z.string()
        .email('Correo electrónico inválido')
        .min(5, 'El email es demasiado corto')
        .max(100, 'El email es demasiado largo')
        .toLowerCase()
        .parse(formData.email);

      if (formData.newPass || formData.currentPass || formData.confirmPass) {
        if (!formData.currentPass) {
          toast.error('Debes ingresar tu contraseña actual');
          return false;
        }
        if (!formData.newPass) {
          toast.error('Debes ingresar una nueva contraseña');
          return false;
        }
        if (formData.newPass !== formData.confirmPass) {
          toast.error('Las contraseñas nuevas no coinciden');
          return false;
        }
        body.currentPass = formData.currentPass;
        body.pass = z.string()
          .max(50, 'La contraseña es demasiado larga')
          .regex(
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/,
            'La contraseña debe incluir una mayúscula, un número y un caracter especial'
          )
          .parse(formData.newPass);
      }

      toastId = toast.loading('Actualizando perfil...');
      setSaving(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/update`,
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
      return true;
    } catch (error) {
      if (toastId) toast.dismiss(toastId);

      if (error instanceof z.ZodError) {
        const first = error.issues[0];
        toast.error(first.message);
      } else {
        toast.error('Error al actualizar perfil');
      }
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    sessionUser,
    formData,
    loading,
    saving,
    showPasswords,
    getUserCreatedAt,
    handleChange,
    updateProfile,
    toggleShowPassword,
  };
};
