import { getFirebaseApp } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const app = await getFirebaseApp();

    return Response.json({
      success: true,
      projectId: app.options.projectId,
      clientEmail: (app.options.credential as any)?.serviceAccount?.clientEmail ?? "unknown",
    });
  } catch (err: any) {
    return Response.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}