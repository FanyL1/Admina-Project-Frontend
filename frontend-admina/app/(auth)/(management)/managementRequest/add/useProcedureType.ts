import toast from 'react-hot-toast';
import { ProcedureTypeFormData } from '@/app/type';

export const createProcedureType = async (formData: ProcedureTypeFormData) => {
  const token = localStorage.getItem('authToken');

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/procedure-types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    const message = data.error || 'Error al crear el tramite';
    toast.error(message);
    throw new Error(message);
  }

  toast.success('Tramite creado exitosamente');
  return data;
};
