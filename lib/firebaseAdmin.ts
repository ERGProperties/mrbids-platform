import {
  cert,
  getApps,
  initializeApp,
  getApp,
} from "firebase-admin/app";

import fs from "fs";

let firebaseApp: ReturnType<
  typeof getApp
> | null = null;

export function getFirebaseApp() {

  if (firebaseApp) {
    return firebaseApp;
  }

  const serviceAccountPath =
    process.env
      .FIREBASE_SERVICE_ACCOUNT_PATH;

  if (!serviceAccountPath) {

    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_PATH missing"
    );
  }

  const serviceAccount =
    JSON.parse(
      fs.readFileSync(
        serviceAccountPath,
        "utf8"
      )
    );

  firebaseApp =
    getApps().length
      ? getApp()
      : initializeApp({
          credential:
            cert(serviceAccount),
        });

  return firebaseApp;
}