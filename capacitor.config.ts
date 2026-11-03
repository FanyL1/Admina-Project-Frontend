import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.admina.app',
  appName: 'Admina',
  webDir: 'out',
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#FFFFFF'
    }
  }
};

export default config;