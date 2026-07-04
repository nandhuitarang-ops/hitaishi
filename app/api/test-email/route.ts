import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "noreply@hitaishii.com";

  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: "RESEND_API_KEY is not set on this server.",
      from,
    });
  }

  const resend = new Resend(apiKey);

  try {
    const res = await resend.emails.send({
      from,
      to: "nandhuequexpert@gmail.com",
      subject: "Hitaishi Live Email Test",
      html: `<h1>Hitaishi Resend Test</h1>
             <p>This test email was successfully triggered from the production server.</p>
             <p><strong>Configured Sender:</strong> ${from}</p>`,
    });

    return NextResponse.json({
      success: true,
      from,
      apiKeyMasked: apiKey.slice(0, 8) + "...",
      resendResponse: res,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      from,
      apiKeyMasked: apiKey.slice(0, 8) + "...",
      error: err.message || err,
    });
  }
}
