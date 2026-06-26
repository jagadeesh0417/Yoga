import { config } from "../config";

export function sendWhatsAppNotification(order: any): void {
  let itemsText = "";
  if (order.items && order.items.length > 0) {
    itemsText = order.items
      .map((item: any) => `${item.name} x${item.quantity} - ₹${Number(item.price).toFixed(2)}`)
      .join("\n");
  }

  const message = [
    "\u{1F9D8} *New Order Received - MYSTIC YOGA Shop*",
    "",
    `*Order:* #${order.orderId}`,
    `*Customer:* ${order.email}`,
    `*Total:* \u{20B9}${Number(order.total).toFixed(2)}`,
    `*Payment:* ${order.paymentMethod} | ${order.paymentStatus}`,
    "",
    "*Items:*",
    itemsText,
  ].join("\n");

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${config.whatsappNumber}?text=${encoded}`;

  console.log("[WhatsApp Notification] URL that would be opened:");
  console.log(url);
}
