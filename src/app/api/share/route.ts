import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { phone, sparkId, sparkTitle, creatorName, raised, goal, backerCount } = await request.json();

    if (!phone || !sparkId) {
      return NextResponse.json({ error: "Phone and sparkId required" }, { status: 400 });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !apiKey || !apiSecret || !fromNumber) {
      return NextResponse.json({ error: "SMS not configured" }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://spark-ignite.vercel.app";
    const sparkUrl = `${appUrl}?spark=${sparkId}`;

    const pct = Math.round((raised / goal) * 100);
    const message = `🔥 ${creatorName} invited you to back "${sparkTitle}" on Ignite!\n\n${pct}% funded · ${backerCount} backers · Needs ${Math.max(0, 3 - backerCount)} more to ignite\n\nVerify as a real human and fund ideas that matter:\n${sparkUrl}`;

    // Use Twilio REST API directly with API Key auth
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const res = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: phone,
        From: fromNumber,
        Body: message,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Twilio error:", data);
      return NextResponse.json({ error: data.message || "SMS failed" }, { status: 400 });
    }

    return NextResponse.json({ success: true, messageSid: data.sid });
  } catch (err) {
    console.error("Share error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
