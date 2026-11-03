'use client';
import { ReactNode } from 'react';
import { usePlatform } from '@/hooks/usePlatform';

export const MobileOnly = ({ children }: { children: ReactNode }) => {
  const { isNative } = usePlatform();
  return isNative ? <>{children}</> : null;
};

export const WebOnly = ({ children }: { children: ReactNode }) => {
  const { isWeb } = usePlatform();
  return isWeb ? <>{children}</> : null;
};
