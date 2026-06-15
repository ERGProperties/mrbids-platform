import { getMessaging }
  from "firebase-admin/messaging";

import { firebaseApp }
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

    await getMessaging(
      firebaseApp
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