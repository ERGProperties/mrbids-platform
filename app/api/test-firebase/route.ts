import { getMessaging } from "firebase-admin/messaging";
import { getFirebaseApp } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const app = await getFirebaseApp();

    const response = await getMessaging(app).send({
      token: "elmueiDufkhvnvqiaxFFJO:APA91bEH4UsYEjcOZz6bGViv_Xgxy18sm9WaxO8XjP_QVUPWWcK3KFnYEk-oDFnfpS7nliVbd4HjjPNIpbFYpy2QWapNz2YuWdkN1Vi1nB8q_c7jkyCfNdY",
      notification: {
        title: "Firebase Test",
        body: "Testing Firebase Admin authentication",
      },
    });

    return Response.json({
      success: true,
      response,
    });

  } catch (err: any) {

    console.error(err);

    return Response.json(
      {
        success: false,
        code: err?.errorInfo?.code,
        message: err?.errorInfo?.message,
        raw: err?.message,
      },
      {
        status: 500,
      }
    );

  }

}