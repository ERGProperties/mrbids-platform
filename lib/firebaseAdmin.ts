import fs from "fs";

import type { App }
  from "firebase-admin/app";

let firebaseApp:
  | App
  | null = null;

export async function getFirebaseApp() {

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

  // Lazy-load firebase-admin only when needed
  const firebaseAdmin =
    await import(
      "firebase-admin/app"
    );

  firebaseApp =
    firebaseAdmin.getApps().length
      ? firebaseAdmin.getApp()
      : firebaseAdmin.initializeApp({

          credential:
            firebaseAdmin.cert(
              serviceAccount
            ),

        });

  return firebaseApp;

}