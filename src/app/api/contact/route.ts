import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Enforce environment validation
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("Missing Gmail credentials in environment variables.");
      return NextResponse.json(
        { error: "Server email credentials not configured" },
        { status: 500 }
      );
    }

    // Create the secure SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Format the email payload securely
    const mailOptions = {
      from: `"${name}" <${process.env.GMAIL_USER}>`, // Send through authenticated user to avoid spoofing rejections
      replyTo: email, // Set the reply-to header to the person's email so you can hit "Reply" in your inbox directly
      to: process.env.GMAIL_USER, // Send it to your own inbox
      subject: `[Terminal Portfolio] New comm from ${name}`,
      text: `SENDER_ID: ${name}\nEMAIL: ${email}\nTIMESTAMP: ${new Date().toISOString()}\n\nDECRYPTED_BODY:\n${message}`,
    };

    // Execute the transmission sequence
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Transmission Failure:", error);
    return NextResponse.json(
      { error: "Failed to route message" },
      { status: 500 }
    );
  }
}
