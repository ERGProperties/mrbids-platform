import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {

  appId: "com.mrbids.app",

  appName: "MrBids",

  webDir: "out",

  ios: {
    scheme: "mrbids",
  },

  android: {
    scheme: "https",
  },

};

export default config;