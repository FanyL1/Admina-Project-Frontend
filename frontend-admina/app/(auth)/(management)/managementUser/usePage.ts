"use client"
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { GetAllUsersResponse, UserData } from "@/app/type";


// Función para obtener todos los usuarios
export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  let toastId: string | undefined;

  try {
    
    toastId = toast.loading('Obteniendo usuarios...');   
    const token = localStorage.getItem('authToken');

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al obtener los usuarios');
      return {
        success: false,
        message: data.error || 'Error al obtener los usuarios',
        details: data.details,
        data: [],
      };
    }

    toast.dismiss(toastId);
    //toast.success('¡Usuarios obtenidos exitosamente!');
    
    return {
      success: true,
      message: 'Usuarios obtenidos exitosamente',
      data: data.data,
    };

  } catch (error: any) {
    if (toastId) toast.dismiss(toastId);
    
    toast.error('Error de conexión con el servidor');
    
    return {
      success: false,
      message: 'Error de conexión con el servidor',
      details: [{ field: 'general', message: error.message }],
      data: [],
    };
  }
};

// Actualizar usuario
export const updateUser = async (id: string, userData: Partial<UserData>) => {
  let toastId: string | undefined;

  try {
    console.log(userData)
    toastId = toast.loading('Actualizando usuario...');
    const token = localStorage.getItem('authToken');

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/update/${id}`, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error('Error al actualizar el usuario');
      return {
        success: false,
        message: data.error || 'Error al actualizar el usuario',
        details: data.details,
      };
    }

    toast.dismiss(toastId);
    toast.success(data.message || '¡Usuario actualizado exitosamente!');
    
    return {
      success: true,
      message: data.message || 'Usuario actualizado exitosamente',
      data: data.data,
    };

  } catch (error: any) {
    if (toastId) toast.dismiss(toastId);
    toast.error('Error de conexión con el servidor');
    
    return {
      success: false,
      message: 'Error de conexión con el servidor',
      details: [{ field: 'general', message: error.message }],
    };
  }
};

// Hook para obtener usuarios
export const useGetAllUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getAllUsers();
    
    if (result.success && result.data) {
      setUsers(result.data);
    } else {
      setError(result.message);
      setUsers([]);
    }
    
    setLoading(false);
  };

  // Función para refrescar manualmente los usuarios
  const refreshUsers = () => {
    setRefetch(prev => prev + 1);
  };

  const update = async (id: string, userData: Partial<UserData>) => {
    const result = await updateUser(id, userData);
    if (result.success) {
      refreshUsers(); // Refresca la lista de usuarios automáticamente tras actualizar exitosamente
    }
    return result;
  };

  useEffect(() => {
    fetchUsers();
  }, [refetch]);

  return { 
    users, 
    loading, 
    error, 
    update,
    refreshUsers,
    refetch: fetchUsers 
  };
};

