'use client';
import { useSyncExternalStore } from 'react';
import { Capacitor } from '@capacitor/core';

const subscribe = () => () => {};
const getSnapshot = () => Capacitor.getPlatform();

/**
 * Indica en qué plataforma corre la app.
 *
 * El prerender estático siempre reporta "web"; la plataforma real se
 * resuelve al montar. Para no repetir condicionales en el JSX usa
 * `<MobileOnly>` o `<WebOnly>` de components/Shared/Platform.
 *
 * @example
 * function BotonAyuda() {
 *   const { isAndroid, isIOS, isWeb } = usePlatform();
 *
 *   if (isAndroid) return <a href="tel:+50700000000">Llamar</a>;
 *   if (isIOS) return <a href="sms:+50700000000">Escribir</a>;
 *   if (isWeb) return <a href="/ayuda">Centro de ayuda</a>;
 *   return null;
 * }
 */
export const usePlatform = () => {
  const platform = useSyncExternalStore(subscribe, getSnapshot, () => 'web');

  return {
    platform,
    isNative: platform !== 'web',
    isWeb: platform === 'web',
    isAndroid: platform === 'android',
    isIOS: platform === 'ios',
  };
};
