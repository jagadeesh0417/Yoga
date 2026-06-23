import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

function getTransporter() {
  const user = process.env.SMTP_USER;
  if (!user || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: { user, pass: process.env.SMTP_PASS },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceId, name, email, phone, country, notes, date, time } = body;

    if (!serviceId || !name || !email || !phone || !country || !date || !time) {
      return Response.json({ error: "All required fields must be filled" }, { status: 400 });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: { serviceId, name, email, phone, country, notes, date, time },
      include: { service: true },
    });

    // Send confirmation email
    const transporter = getTransporter();
    if (transporter) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mysticyoga.global";

      // Student confirmation
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"MYSTIC YOGA" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Booking Confirmation - MYSTIC YOGA",
        html: `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #F8F5F0; padding: 40px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #7A3045; font-size: 28px; margin: 0;">MYSTIC YOGA™</h1>
              <p style="color: #D4A373; font-size: 14px;">Awaken Your Inner Power. Transform Your Life.</p>
            </div>
            <h2 style="color: #1E1E1E; font-size: 22px;">Booking Confirmed! 🙏</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">Thank you, <strong>${name}</strong>! Your booking has been received successfully.</p>
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #D4A37330;">
              <h3 style="color: #7A3045; margin: 0 0 15px 0;">Booking Details</h3>
              <table style="width: 100%; font-size: 14px; color: #555;">
                <tr><td style="padding: 6px 0; color: #888;">Service</td><td style="padding: 6px 0;"><strong>${service.title}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #888;">Date</td><td style="padding: 6px 0;"><strong>${date}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #888;">Time</td><td style="padding: 6px 0;"><strong>${time}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #888;">Duration</td><td style="padding: 6px 0;"><strong>${service.duration || "TBD"}</strong></td></tr>
                ${service.price ? `<tr><td style="padding: 6px 0; color: #888;">Investment</td><td style="padding: 6px 0;"><strong>$${service.price}</strong></td></tr>` : ""}
              </table>
            </div>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">We will review your booking and confirm the schedule shortly. If you have any questions, please contact us on WhatsApp.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://wa.me/85244644381" style="display: inline-block; background: #25D366; color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-size: 14px; font-weight: bold;">Chat on WhatsApp</a>
            </div>
            <p style="color: #888; font-size: 12px; text-align: center;">With love,<br>Sunita Singh & The MYSTIC YOGA Team</p>
          </div>
        `,
      });

      // Notification to Sunita
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"MYSTIC YOGA Bookings" <${process.env.SMTP_USER}>`,
        to: process.env.NOTIFICATION_EMAIL || "info@mysticyoga.global",
        subject: `New Booking: ${service.title} - ${name}`,
        html: `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #F8F5F0; padding: 40px; border-radius: 12px;">
            <h2 style="color: #7A3045;">New Booking Received</h2>
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #D4A37330;">
              <h3 style="color: #7A3045; margin: 0 0 15px 0;">Student Details</h3>
              <table style="width: 100%; font-size: 14px; color: #555;">
                <tr><td style="padding: 6px 0; color: #888;">Name</td><td style="padding: 6px 0;"><strong>${name}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #888;">Email</td><td style="padding: 6px 0;"><strong>${email}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #888;">Phone</td><td style="padding: 6px 0;"><strong>${phone}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #888;">Country</td><td style="padding: 6px 0;"><strong>${country}</strong></td></tr>
              </table>
              <h3 style="color: #7A3045; margin: 20px 0 15px 0;">Booking Details</h3>
              <table style="width: 100%; font-size: 14px; color: #555;">
                <tr><td style="padding: 6px 0; color: #888;">Service</td><td style="padding: 6px 0;"><strong>${service.title}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #888;">Date</td><td style="padding: 6px 0;"><strong>${date}</strong></td></tr>
                <tr><td style="padding: 6px 0; color: #888;">Time</td><td style="padding: 6px 0;"><strong>${time}</strong></td></tr>
                ${notes ? `<tr><td style="padding: 6px 0; color: #888;">Notes</td><td style="padding: 6px 0;"><strong>${notes}</strong></td></tr>` : ""}
              </table>
            </div>
            <p style="color: #888; font-size: 12px;">Booking ID: ${booking.id}</p>
          </div>
        `,
      });
    }

    return Response.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return Response.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
