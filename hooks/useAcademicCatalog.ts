'use client';

import { useSyncExternalStore } from 'react';

import {
  CATALOG_CHANGE_EVENT,
  PENSUM_CATALOG_KEY,
  loadPensumCatalog,
} from '@/app/lib/academicCatalog';
import type { PensumParseResult } from '@/app/lib/academicPdf';

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener(CATALOG_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CATALOG_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
};

let pensumRaw: string | null | undefined;
let pensumSnapshot: PensumParseResult | null = null;

const getPensumSnapshot = (): PensumParseResult | null => {
  const raw = typeof window === 'undefined' ? null : window.localStorage.getItem(PENSUM_CATALOG_KEY);
  if (raw !== pensumRaw) {
    pensumRaw = raw;
    pensumSnapshot = loadPensumCatalog();
  }
  return pensumSnapshot;
};

const getServerPensumSnapshot = (): PensumParseResult | null => null;

export const usePensumCatalog = () =>
  useSyncExternalStore(subscribe, getPensumSnapshot, getServerPensumSnapshot);
