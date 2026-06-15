import { getMessaging }
  from "firebase-admin/messaging";

import { getFirebaseApp }
  from "@/lib/firebaseAdmin";

export async function sendPushNotification({
  token,
  title,
  body,
  url,
}: {
  token: string;

  title: string;

  body: string;

  url?: string;
}) {

  try {

    const app =
      getFirebaseApp();

    await getMessaging(
      app
    ).send({
      token,

      notification: {
        title,
        body,
      },

      data: {
        url:
          url || "/",
      },
    });

  } catch (err) {

    console.error(
      "PUSH SEND ERROR:",
      err
    );
  }
}