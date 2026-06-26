import nodemailer from "nodemailer";
import { config } from "../config";

function getTransporter() {
  if (!config.smtp.user || !config.smtp.pass) {
    console.warn("SMTP_USER not configured — skipping email sending");
    return null;
  }
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
  });
}

function itemsTableHtml(items: Array<{ name: string; quantity: number; price: number }>): string {
  const rows = items
    .map(
      (item) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #ddd;">${item.name}</td><td style="padding:8px;border-bottom:1px solid #ddd;text-align:center;">${item.quantity}</td><td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">₹${Number(item.price).toFixed(2)}</td><td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">₹${(Number(item.price) * item.quantity).toFixed(2)}</td></tr>`
    )
    .join("");
  return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <thead><tr style="background:#f3f4f6;"><th style="padding:8px;text-align:left;">Item</th><th style="padding:8px;text-align:center;">Qty</th><th style="padding:8px;text-align:right;">Price</th><th style="padding:8px;text-align:right;">Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

export async function sendOrderConfirmation(order: any, userEmail: string): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;
  try {
    await transporter.sendMail({
      from: config.smtp.from,
      to: userEmail,
      subject: `Order Confirmed — ${order.orderId}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h1 style="color:#7c3aed;">Thank you for your order!</h1>
          <p>Hi <strong>${order.email}</strong>,</p>
          <p>Your order <strong>#${order.orderId}</strong> has been placed successfully.</p>
          ${itemsTableHtml(order.items || [])}
          <p style="font-size:18px;"><strong>Total: ₹${Number(order.total).toFixed(2)}</strong></p>
          <p><strong>Shipping Address:</strong><br/>${order.shippingAddress ? `${order.shippingAddress.line1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}` : "—"}</p>
          <p>We'll notify you once your order ships.</p>
          <p style="color:#6b7280;font-size:14px;">— MYSTIC YOGA Team</p>
        </div>`,
    });
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
  }
}

export async function sendAdminNotification(order: any): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;
  try {
    await transporter.sendMail({
      from: config.smtp.from,
      to: config.adminEmail,
      subject: `New Order Received — ${order.orderId}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#7c3aed;">New Order Alert</h2>
          <p><strong>Order:</strong> #${order.orderId}</p>
          <p><strong>Customer:</strong> ${order.email}</p>
          <p><strong>Total:</strong> ₹${Number(order.total).toFixed(2)}</p>
          <p><strong>Payment:</strong> ${order.paymentMethod.toUpperCase()} — ${order.paymentStatus}</p>
          ${itemsTableHtml(order.items || [])}
          <p>View in dashboard to process this order.</p>
        </div>`,
    });
  } catch (err) {
    console.error("Failed to send admin notification email:", err);
  }
}
