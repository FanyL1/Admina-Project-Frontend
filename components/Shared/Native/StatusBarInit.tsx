'use client';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

// Fondo claro de la app: texto oscuro en la barra de estado.
export default function StatusBarInit() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    StatusBar.setStyle({ style: Style.Light }).catch(() => {});
  }, []);

  return null;
}
