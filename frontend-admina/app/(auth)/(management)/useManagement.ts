"use client"
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';

export const updateStatus = async (id: string) => {
    let toastId: string | undefined;
  try { 

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/status/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error al actualizar el estado');
    }

    toast.dismiss(toastId);
    toast.success('¡Estado cambiado exitosamente!');

    return data;
  } catch (error) {
    throw error;
  }
};

export const updateRol = async (id: string,  roleName: string) => {
    let toastId: string | undefined;
  try { 

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/role/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({
        name: roleName
      })
    });
    
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error al actualizar el rol');
    }

    toast.dismiss(toastId);
    toast.success('¡Rol cambiado exitosamente!', data.name);

    return data;
  } catch (error) {
    throw error;
  }
};