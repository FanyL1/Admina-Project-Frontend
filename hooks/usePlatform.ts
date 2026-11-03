'use client';
import { useSyncExternalStore } from 'react';
import { Capacitor } from '@capacitor/core';

const subscribe = () => () => {};
// El export estático se prerenderiza como web; useSyncExternalStore reconcilia al montar.
const getSnapshot = () => Capacitor.getPlatform();

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
