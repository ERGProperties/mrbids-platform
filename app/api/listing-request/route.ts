import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // 🔍 Log to confirm the API route is hit
    console.log("📩 LISTING REQUEST RECEIVED");

    // 1. Parse incoming request body
    const body = await req.json();

    const {
      name,
      email,
      address,
      propertyType,
      notes,
    } = body;

    // 2. Basic validation
    if (!name || !email || !address || !propertyType) {
      console.error("❌ Missing required fields", body);
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // 3. Send email using Resend (verified sender)
    const result = await resend.emails.send({
      from: "MrBids <onboarding@resend.dev>", // ✅ works without domain verification
      to: ["gary@erg-properties.com"],         // 🔴 CHANGE THIS
      subject: "New Seller Listing Request – MrBids",
      html: `
        <h2>New Seller Listing Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Property Address:</strong> ${address}</p>
        <p><strong>Property Type:</strong> ${propertyType}</p>
        <p><strong>Notes:</strong><br/>${notes || "None"}</p>
      `,
    });

    // 🔍 Log Resend response
    console.log("📧 RESEND RESULT:", result);

    // 4. Respond back to the browser
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (error) {
    console.error("🔥 LISTING REQUEST FAILED:", error);

    return new Response(
      JSON.stringify({ success: false }),
      { status: 500 }
    );
  }
}
