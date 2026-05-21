/*
ESTO ES UN PROTOTIPO DESARROLLADO PARA PROBAR LA CONEXION CON EL BACKEND.
SE PUEDE TOMAR COMO EJEMPLO DE COMO REALIZAR PETICIONES AL BACKEND
*/


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
  try {

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
      return {
        success: false,
        message: data.error || 'Error en el registro',
        details: data.details,
        data: data,
      };
    }

    return {
      success: true,
      message: '¡Registro exitoso!',
      data: data,
    };

  } catch (error: any) {
    return {
      success: false,
      message: 'Error de conexión con el servidor',
      details: [{ field: 'general', message: error.message }],
    };
  }
};