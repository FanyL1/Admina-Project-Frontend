import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { StudentRequestData, RequestResponse} from '@/app/type';
import { useLogin } from '@/app/login/useLogin';

export const getAllRequest = async (): Promise<RequestResponse> => {
  let toastId: string | undefined;

  try {
    
    const token = localStorage.getItem('authToken')
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

  
    const data = await res.json();

    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al obtener solicitudes');
      return {
        success: false,
        message: data.error || 'Error al obtener solicitudes',
        data: [],
      };
    }

    toast.dismiss(toastId);
    //toast.success('¡Solicitudes obtenidas exitosamente!');
    
    return {
      success: true,
      message: 'Solicitudes obtenidas exitosamente',
      data: data.data,
    };

  } catch (error: any) {
    if (toastId) toast.dismiss(toastId);
    toast.error('Error de conexión con el servidor');
    
    return {
      success: false,
      message: 'Error de conexión con el servidor',
      data: [],
    };
  }
};


export const getAllRequestByUserLogeado = async (userId: string | undefined): Promise<RequestResponse> => {
  let toastId: string | undefined;
  
  try {
    
    const token = localStorage.getItem('authToken')
    console.log(userId)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/requests/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

  
    const data = await res.json();

    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al obtener solicitudes');
      return {
        success: false,
        message: data.error || 'Error al obtener solicitudes',
        data: [],
      };
    }

    toast.dismiss(toastId);
    //toast.success('¡Solicitudes obtenidas exitosamente!');
    console.log(data.data);
    
    return {
      success: true,
      message: 'Solicitudes obtenidas exitosamente',
      data: data.data,
    };

  } catch (error: any) {
    if (toastId) toast.dismiss(toastId);
    toast.error('Error de conexión con el servidor');
    
    return {
      success: false,
      message: 'Error de conexión con el servidor',
      data: [],
    };
  }
};

export const getAllRequestByRevisor = async (userId: string | undefined): Promise<RequestResponse> => {
  let toastId: string | undefined;
  
  try {
    
    const token = localStorage.getItem('authToken')
    console.log(userId)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/requests/admin/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

  
    const data = await res.json();

    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data.error || 'Error al obtener solicitudes');
      return {
        success: false,
        message: data.error || 'Error al obtener solicitudes',
        data: [],
      };
    }

    toast.dismiss(toastId);
    //toast.success('¡Solicitudes obtenidas exitosamente!');
    console.log(data.data);
    
    return {
      success: true,
      message: 'Solicitudes obtenidas exitosamente',
      data: data.data,
    };

  } catch (error: any) {
    if (toastId) toast.dismiss(toastId);
    toast.error('Error de conexión con el servidor');
    
    return {
      success: false,
      message: 'Error de conexión con el servidor',
      data: [],
    };
  }
};


// Hook personalizado para obtener carerras
export const useGetAllRequest = () => {

  const {sessionUser} = useLogin()
  const userId = sessionUser?.id
  const [request, setRequest] = useState<StudentRequestData[]>([]);
  const [requestUser, setRequestUser] = useState<StudentRequestData[]>([])
  const [requestRevisor, setRequestRevisor] = useState<StudentRequestData[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(0);
  const [refetchRequestUser, setRefetchRequestUser] = useState(0);
  const [refetchRequestRevisor, setRefetchRequestRevisor] = useState(0);
  
  const fetchRequest = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getAllRequest();
    
    if (result.success && result.data) {
      setRequest(result.data);
    } else {
      setError(result.message);
      setRequest([]);
    }
    
    setLoading(false);
  };

  const fetchRequestUser = async (userId : string | undefined) => {
    if (!userId) {
      setError(" fetchRequestUser abortado: El userId aún es undefined");
      return;
    }

    setLoading(true);
    setError(null);
    
    const resultUser = await getAllRequestByUserLogeado(userId)

    if (resultUser.success && resultUser.data) {
      setRequestUser(resultUser.data);
    } else {
      setError(resultUser.message);
      setRequestUser([]);
    }
    
    setLoading(false);
  };

  const fetchRequestRevisor = async (userId : string | undefined) => {
    if (!userId) {
      setError(" fetchRequestUser abortado: El userId aún es undefined");
      return;
    }

    setLoading(true);
    setError(null);
    const resultRevisor = await getAllRequestByRevisor(userId)

    if (resultRevisor.success && resultRevisor.data) {
      setRequestRevisor(resultRevisor.data);
    } else {
      setError(resultRevisor.message);
      setRequestRevisor([]);
    }
    
    setLoading(false);
  };

  const refreshRequest = () => {
    setRefetch(prev => prev + 1);
  };
  const refreshRequestUser = () => {
    setRefetchRequestUser(prev => prev + 1);
  };
  const refreshRequestRevisor = () => {
    setRefetchRequestRevisor(prev => prev + 1);
  };

  useEffect(() => {
    fetchRequest();
  }, [refetch]);

  useEffect(() => {
    fetchRequestUser(userId);
  }, [userId, refetchRequestUser]);

  useEffect(() => {
    fetchRequestRevisor(userId);
  }, [userId, refetchRequestRevisor]);

  console.log(requestUser)
  return { 
    request,
    requestUser,
    requestRevisor,
    loading, 
    error, 
    refreshRequest,
    refreshRequestUser,
    refreshRequestRevisor,
    refetch: fetchRequest,
    refetchRequestUser: fetchRequestUser,
    refetchRequestRevisor: fetchRequestRevisor
  };
};