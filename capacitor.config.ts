import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mrbids.app",
  appName: "MrBids",

  webDir: "out",

  server: {
    url: "https://mrbids.com",
    cleartext: false,
    androidScheme: "https",
  },

  ios: {
    scheme: "mrbids",
  },
};

export default config;