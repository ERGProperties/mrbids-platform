import { getMessaging } from "firebase-admin/messaging";
import { getFirebaseApp } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const app = await getFirebaseApp();

    // This forces Firebase Admin to initialize.
    getMessaging(app);

    return Response.json({
      success: true,
      project: app.options.projectId,
    });
  } catch (err: any) {
    console.error(err);

    return Response.json(
      {
        success: false,
        error: err.message,
        code: err.code,
      },
      { status: 500 }
    );
  }
}