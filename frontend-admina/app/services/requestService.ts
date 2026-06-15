'use client';

import { ProcedureTypeData, StudentRequestData, RequestDocumentData, RequestStatus, OnlyNameData } from '@/app/type';

type ApiResult<T> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  details?: Array<{ field: string; message: string }>;
};

const backendUrl = () => process.env.NEXT_PUBLIC_BACKEND_URL;

const authHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const parseResponse = async <T>(res: Response): Promise<ApiResult<T>> => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Error en la solicitud');
  }
  return data;
};

export const requestStatusOptions: RequestStatus[] = [
  'Enviado',
  'Revisando',
  'Pendiente',
  'Observado',
  'Aprobado',
  'Rechazado',
];

export const getProcedureTypes = async () => {
  const res = await fetch(`${backendUrl()}/api/procedure-types`, {
    method: 'GET',
    headers: authHeaders(),
  });
  const data = await parseResponse<ProcedureTypeData[]>(res);
  return data.data || [];
};

export const getDegrees = async () => {
  const res = await fetch(`${backendUrl()}/api/degree`, {
    method: 'GET',
    headers: authHeaders(),
  });
  const data = await parseResponse<OnlyNameData[]>(res);
  return data.data || [];
};

export const getRequests = async () => {
  const res = await fetch(`${backendUrl()}/api/requests`, {
    method: 'GET',
    headers: authHeaders(),
  });
  const data = await parseResponse<StudentRequestData[]>(res);
  return data.data || [];
};

export const getRequestsByUser = async (userId: string) => {
  const res = await fetch(`${backendUrl()}/api/requests/user/${userId}`, {
    method: 'GET',
    headers: authHeaders(),
  });
  const data = await parseResponse<StudentRequestData[]>(res);
  return data.data || [];
};

export const getRequestById = async (id: string) => {
  const res = await fetch(`${backendUrl()}/api/requests/${id}`, {
    method: 'GET',
    headers: authHeaders(),
  });
  const data = await parseResponse<StudentRequestData>(res);
  return data.data;
};

export const getRequestDocuments = async (requestId: string) => {
  const res = await fetch(`${backendUrl()}/api/requests/${requestId}/documents`, {
    method: 'GET',
    headers: authHeaders(),
  });
  const data = await parseResponse<RequestDocumentData[]>(res);
  return data.data || [];
};

export const createRequest = async (payload: {
  user_id: string;
  createByname?: string;
  createByDNI?: string;
  type_id: string;
  carrera_id: string;
  observation?: string | null;
}) => {
  const res = await fetch(`${backendUrl()}/api/requests`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await parseResponse<StudentRequestData>(res);
  return data.data;
};

export const uploadRequestDocument = async (requestId: string, requirementName: string, file: File) => {
  const token = localStorage.getItem('authToken');
  const body = new FormData();
  body.append('name_requeriments', requirementName);
  body.append('documents', file);

  const res = await fetch(`${backendUrl()}/api/requests/${requestId}/oneDocuments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  return parseResponse<RequestDocumentData>(res);
};

export const updateRequestReview = async (
  requestId: string,
  payload: { status: RequestStatus; observation?: string | null },
) => {
  const res = await fetch(`${backendUrl()}/api/requests/${requestId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await parseResponse<StudentRequestData>(res);
  return data.data;
};
