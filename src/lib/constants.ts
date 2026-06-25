export const WHATSAPP_NUMBER = "919164081909";

export function whatsappUrl(message: string = "Hi! I'm interested in MYSTIC YOGA™ programs.") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
