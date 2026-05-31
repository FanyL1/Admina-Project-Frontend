export interface SignUpData {
  name: string;
  lastname: string;
  dni: string;
  email: string;
  pass: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  data?: any;
  details?: Array<{ field: string; message: string }>;
}

export interface LoginData {
    email: string;
    pass: string;
}

export interface Session {
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
        created_at: string;
        status: string;
        role?: {
            id: string;
            name: string;
        };
    };
    details?: Array<{ field: string; message: string }>;
}


export type UserRole = 'Estudiante' | 'Administrativo' | 'Superusuario';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
  sectionId?: string;
}