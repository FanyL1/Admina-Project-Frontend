// src/types/auth.ts
export interface LoginData {
    email: string;
    pass: string;
}

export interface SignUpData {
    name: string;
    lastname: string;
    dni: string;
    email: string;
    pass: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string;
    expiresIn?: number;
    user?: {
        id: string;
        name: string;
        lastname: string;
        email: string;
        dni: string;
        role?: {
            id: string;
            name: string;
        };
    };
    details?: Array<{ field: string; message: string }>;
}