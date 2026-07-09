import { NextRequest, NextResponse } from "next/server";

import { getFirebaseApp } from "@/lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

export async function POST(
  request: NextRequest
) {

  try {

const {
  provider,
  idToken,
} = await request.json();

if (
  provider !== "apple" &&
  provider !== "google"
) {

  return NextResponse.json({

    success: false,

    error: "Invalid provider.",

  }, {

    status: 400,

  });

}

    if (!idToken) {

      return NextResponse.json({

        success: false,

        error: "Missing idToken.",

      }, {

        status: 400,

      });

    }

    const firebaseApp =
      getFirebaseApp();

    const decoded =
      await getAuth(firebaseApp)
        .verifyIdToken(idToken);

    return NextResponse.json({

      success: true,

      provider,

      firebase: {

        uid:
          decoded.uid,

        email:
          decoded.email,

        emailVerified:
          decoded.email_verified,

        name:
          decoded.name,

        picture:
          decoded.picture,

      },

    });

  } catch (err) {

    console.error(
      "Native Auth Error:",
      err
    );

    return NextResponse.json({

      success: false,

      error:
        "Invalid Firebase token.",

    }, {

      status: 401,

    });

  }

}

export async function GET() {

  return NextResponse.json({

    success: true,

    message:
      "Native auth endpoint is working.",

  });

}