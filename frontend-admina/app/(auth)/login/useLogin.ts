// src/services/authService.ts
import { LoginData, SignUpData, AuthResponse } from './type';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const authService = {
    login: async (data: LoginData): Promise<AuthResponse> => {
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    pass: data.pass,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: result.error || 'Error en el login',
                    details: result.details,
                };
            }

            if (result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
            }

            return {
                success: true,
                message: result.message || 'Login exitoso',
                token: result.token,
                expiresIn: result.expiresIn,
                user: result.user,
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error de conexión con el servidor',
                details: [{ field: 'general', message: error.message }],
            };
        }
    },

    logout: (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    },

    getUser: () => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    isAuthenticated: (): boolean => {
        return !!authService.getToken();
    },
};