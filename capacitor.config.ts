import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {

  appId: "com.mrbids.app",

  appName: "MrBids",

  webDir: ".next",

  ios: {
    scheme: "mrbids",
  },

};

export default config;