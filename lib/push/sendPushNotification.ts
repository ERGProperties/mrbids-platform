import { getMessaging }
  from "firebase-admin/messaging";

import { getFirebaseApp }
  from "@/lib/firebaseAdmin";

import { prisma }
  from "@/lib/prisma";

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
      await getFirebaseApp();

    console.log("========== SENDING PUSH ==========");

    console.log({
      token:
        token.substring(0, 20) + "...",
      title,
      body,
      url,
    });

    const response =
      await getMessaging(app).send({
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

    console.log(
      "✅ PUSH SENT SUCCESSFULLY:",
      response
    );

  } catch (err: any) {

    console.error(
      "❌ PUSH SEND ERROR:",
      err
    );

    console.error(
      "Firebase Error Code:",
      err?.errorInfo?.code
    );

    console.error(
      "Firebase Error Message:",
      err?.errorInfo?.message
    );

    const errorCode =
      err?.errorInfo?.code;

    // REMOVE INVALID TOKENS
    if (
      errorCode ===
        "messaging/registration-token-not-registered" ||

      errorCode ===
        "messaging/invalid-registration-token"
    ) {

      try {

        await prisma.pushSubscription.deleteMany({
          where: {
            endpoint:
              token,
          },
        });

        console.log(
          "🗑 Removed invalid push token"
        );

      } catch (deleteErr) {

        console.error(
          "Failed removing invalid token:",
          deleteErr
        );

      }

    }

  }

}