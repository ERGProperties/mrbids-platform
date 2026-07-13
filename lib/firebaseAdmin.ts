import type { App } from "firebase-admin/app";

let firebaseApp: App | null = null;

export async function getFirebaseApp() {
  if (firebaseApp) {
    return firebaseApp;
  }

  const serviceAccountJson =
    process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountJson) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT missing"
    );
  }

  const serviceAccount =
    JSON.parse(serviceAccountJson);

  // Lazy-load firebase-admin only when needed
  const firebaseAdmin =
    await import("firebase-admin/app");

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