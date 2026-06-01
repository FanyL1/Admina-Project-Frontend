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

export interface UserData {
  id: string;
  name: string;  
  lastname: string;  
  dni: string;      
  email: string;
  status: string;    
  created_at: string;
  role: {
    id: string;
    name: string;   
  };
}

export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  data?: UserData[];
  details?: any;
}

export type Order = 'asc' | 'desc';

export interface Column {
  id: string;
  label: string;
  numeric: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface DataTableProps {
  data: any[];
  columns: Column[];
  title?: string;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onEdit?: (row: any) => void;
  onToggleStatus?: (row: any) => void;
  onRolChange?: (row: any, newRol: string) => void;
  getRowId: (row: any) => string | number;
  filterFields?: {
    searchFields: { [key: string]: boolean };
    onSearchFieldsChange: (fields: any) => void;
    rolFilter: string;
    onRolFilterChange: (rol: string) => void;
    estadoFilter: string;
    onEstadoFilterChange: (estado: string) => void;
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    rolOptions?: Array<{ value: string; label: string }>;
    estadoOptions?: Array<{ value: string; label: string }>;
  };
}

export interface RoleData {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetAllRolesResponse {
  success: boolean;
  message: string;
  data?: RoleData[];
}