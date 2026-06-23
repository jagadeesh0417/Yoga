import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();
    if (!name || !email || !message) {
      return Response.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    if (process.env.SMTP_USER) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"Contact Form" <${process.env.SMTP_USER}>`,
        to: process.env.NOTIFICATION_EMAIL || "info@mysticyoga.global",
        subject: `Contact Form: ${subject || "New Message"} from ${name}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#7A3045;">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
          <p><strong>Message:</strong></p>
          <p style="background:#f5f5f5;padding:15px;border-radius:8px;">${message}</p>
        </div>`,
      });
    }

    return Response.json({ success: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
