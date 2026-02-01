import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // 🔍 Log so we can see this in Vercel
    console.log("📩 LISTING REQUEST RECEIVED");

    const body = await req.json();

    const {
      name,
      email,
      address,
      propertyType,
      notes,
    } = body;

    // 🛑 Basic validation
    if (!name || !email || !address || !propertyType) {
      console.error("❌ Missing required fields:", body);
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // 📧 Send email
    const result = await resend.emails.send({
      from: "MrBids <support@mrbids.com>",
      to: ["gwalker1121@comcast.net"], // change if needed
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

    console.log("📧 EMAIL SENT:", result);

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
