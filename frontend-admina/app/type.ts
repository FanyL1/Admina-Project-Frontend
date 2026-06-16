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
  toolbarActions?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
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
    searchLabels?: { [key: string]: string };
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

export interface OnlyNameData {
  id: string;
  name: string;
}

export interface GetAllResponseOnlyName {
  success: boolean;
  message: string;
  data?: OnlyNameData[];
}

export interface DegreeData {
  id: string;
  name: string;
  status?: 'active' | 'inactive';
}

export interface GetAllResquest {
  id: string;
  user_id: String;
  createByname: string;
  createByDNI: string;
  type_id: string;
  carrera_id: string;
  observation: string;
  status?: 'active' | 'inactive';
}
export interface ProcedureRequirements {
  documents: string[];
  promedio: string[];
  [key: string]: unknown;
}

export interface ProcedureTypeData {
  id: string;
  name: string;
  category_id:string;
  requirements: ProcedureRequirements;
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}
export interface ProcedureTypeFormData {
  name: string;
  category_id:string;
  requirements: ProcedureRequirements;
}

export interface GetAllTypeResponse {
  success: boolean;
  message: string;
  data?: ProcedureTypeData[];
}

export type RequestStatus = 'Enviado' | 'Revisando' | 'Pendiente' | 'Observado' | 'Aprobado' | 'Rechazado';

export interface RequestUserData {
  id: string;
  name: string;
  lastname: string;
  dni?: string;
  email?: string;
}

export interface RequestDocumentData {
  id: string;
  request_id: string;
  name_requeriments: string;
  name_file?: string;
  router_file?: string;
  size_bytes?: number;
  status?: string;
}

export interface StudentRequestData {
  id: string;
  user_id: string;
  createByname?: string;
  createByDNI?: string;
  type_id: string;
  carrera_id: string;
  observation?: string | null;
  status: RequestStatus;
  created_at: string;
  updated_at?: string;
  user?: RequestUserData;
  type_procedure?: ProcedureTypeData;
  carrera?: OnlyNameData;
  documents?: RequestDocumentData[];
}

export interface LogsData{
  id: string;
  date: string;
  user_id: string;
  action: string;
  description: string;
  resourceId: string;
  resourceType: string
}
export interface LogResponse {
  success: boolean;
  message: string;
  data?: LogsData[]
}
