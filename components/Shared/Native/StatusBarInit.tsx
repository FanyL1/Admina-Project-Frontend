'use client';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Fija el estilo de la barra de estado de Android/iOS. Se monta una sola vez
 * en app/layout.tsx y no recibe props.
 *
 * @example
 * // app/layout.tsx
 * <CssBaseline />
 * <StatusBarInit />
 * {children}
 */
export default function StatusBarInit() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    StatusBar.setStyle({ style: Style.Light }).catch(() => {});
  }, []);

  return null;
}
