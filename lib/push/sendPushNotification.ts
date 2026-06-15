import { firebaseAdmin }
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

    await firebaseAdmin
      .messaging()
      .send({
        token,

        notification: {
          title,
          body,
        },

        data: {
          url: url || "/",
        },
      });

  } catch (err) {

    console.error(
      "PUSH SEND ERROR:",
      err
    );
  }
}