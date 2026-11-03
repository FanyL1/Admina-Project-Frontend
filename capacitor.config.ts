import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.admina.app',
  appName: 'Admina',
  webDir: 'out',
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#FFFFFF'
    },
    // viewport-fit=cover desde el primer frame; evita el salto de layout.
    SystemBars: {
      initialViewportFitValueHint: 'cover'
    }
  }
};

export default config;