import {
  cert,
  getApps,
  initializeApp,
  getApp,
} from "firebase-admin/app";

import fs from "fs";

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

const firebaseApp =
  getApps().length
    ? getApp()
    : initializeApp({
        credential:
          cert(serviceAccount),
      });

export {
  firebaseApp,
};