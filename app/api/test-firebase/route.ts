import { getMessaging } from "firebase-admin/messaging";
import { getFirebaseApp } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const app = await getFirebaseApp();

    const messaging = getMessaging(app);

    return Response.json({
      success: true,
      appProjectId: app.options.projectId,
      messagingProjectId: (messaging as any).app.options.projectId,
    });

  } catch (err: any) {

    console.error(err);

    return Response.json(
      {
        success: false,
        message: err.message,
        code: err.code,
      },
      { status: 500 }
    );
  }
}