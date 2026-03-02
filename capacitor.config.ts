import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.investmentassistant.app',
  appName: 'Investment Assistant',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
