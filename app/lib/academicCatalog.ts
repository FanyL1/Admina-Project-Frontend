/**
 * Catálogo académico local (static export no tiene backend para este dato).
 * El pensum cargado por el administrador se reutiliza en el formulario de solicitudes.
 */

import type { PensumParseResult } from './academicPdf';

// v2: los datos guardados con v1 conservaban advertencias y filas mal parseadas
// antes de la corrección del parser de pensum. Se ignoran y se pide recargar el PDF.
export const PENSUM_CATALOG_KEY = 'admina:pensum-catalog:v2';
export const CATALOG_CHANGE_EVENT = 'admina:academic-catalog-change';

const isBrowser = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const notifyChange = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(CATALOG_CHANGE_EVENT));
};

export const loadPensumCatalog = (): PensumParseResult | null => {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(PENSUM_CATALOG_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PensumParseResult;
    return Array.isArray(parsed?.courses) ? parsed : null;
  } catch {
    return null;
  }
};

export const savePensumCatalog = (pensum: PensumParseResult): void => {
  if (!isBrowser()) return;
  window.localStorage.setItem(PENSUM_CATALOG_KEY, JSON.stringify(pensum));
  notifyChange();
};

export const clearPensumCatalog = (): void => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(PENSUM_CATALOG_KEY);
  notifyChange();
};
