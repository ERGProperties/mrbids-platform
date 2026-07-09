import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.json();

    console.log(
      "Native Auth Request:",
      body
    );

    return NextResponse.json({

      success: true,

      received: body,

    });

  } catch (err) {

    console.error(err);

    return NextResponse.json({

      success: false,

      error: "Invalid request.",

    }, {

      status: 400,

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