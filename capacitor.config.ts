import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mrbids.MrBids",
  appName: "MrBids Auctions",

  webDir: "out",

  server: {
    url: "https://mrbids.com",
    cleartext: false,
    androidScheme: "https",
  },

  ios: {
    scheme: "mrbids",
  },

  plugins: {
    FirebaseAuthentication: {
      providers: [
        "apple.com",
        "google.com",
      ],
    },
  },
};

export default config;