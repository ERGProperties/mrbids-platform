import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mrbids.app',
  appName: 'MrBids',

  server: {
    url: 'https://mrbids.com',
    cleartext: false,
  },
};

export default config;