export const WHATSAPP_NUMBER = "85244644381";

export function whatsappUrl(message: string = "Hi! I'm interested in MYSTIC YOGA™ programs.") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
