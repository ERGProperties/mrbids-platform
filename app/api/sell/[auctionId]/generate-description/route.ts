import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    // ⭐ create client INSIDE handler (build-safe)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await request.json();

    const {
      propertyType,
      beds,
      baths,
      sqft,
      condition,
      cityStateZip,
    } = body;

    const prompt = `
Write a professional real estate auction listing description for an investor audience.

Property Details:
- Type: ${propertyType}
- Bedrooms: ${beds}
- Bathrooms: ${baths}
- Square Feet: ${sqft}
- Condition: ${condition}
- Location: ${cityStateZip}

Keep it concise, compelling, and investor-focused.
Do not exaggerate. Do not invent facts.
Tone: professional, confident, factual.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You write professional real estate listing descriptions.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
    });

    const description =
      response.choices[0]?.message?.content ?? "";

    return NextResponse.json({ description });
  } catch (error) {
    console.error("AI generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}