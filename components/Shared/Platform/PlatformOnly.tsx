'use client';
import { ReactNode } from 'react';
import { usePlatform } from '@/hooks/usePlatform';

/**
 * Muestra sus hijos solo dentro de la app nativa (Android o iOS).
 *
 * @example
 * <MobileOnly>
 *   <BotonCompartirNativo />
 * </MobileOnly>
 */
export const MobileOnly = ({ children }: { children: ReactNode }) => {
  const { isNative } = usePlatform();
  return isNative ? <>{children}</> : null;
};

/**
 * Muestra sus hijos solo en el navegador.
 *
 * @example
 * <WebOnly>
 *   <Navbar />
 * </WebOnly>
 */
export const WebOnly = ({ children }: { children: ReactNode }) => {
  const { isWeb } = usePlatform();
  return isWeb ? <>{children}</> : null;
};
