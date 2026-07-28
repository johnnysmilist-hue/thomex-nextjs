import type { CartLine } from "@/context/CartContext";

export type CustomerDetails = {
  name: string;
  phone: string;
  location: string;
  notes: string;
};

export function formatOrderMessage(
  customer: CustomerDetails,
  lines: CartLine[],
  subtotal: number
) {
  const itemLines = lines
    .map(
      (l) =>
        `- ${l.product.name} x${l.qty} — KSh ${(l.product.price * l.qty).toLocaleString()}`
    )
    .join("\n");

  return [
    "New Thomex order",
    "",
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Delivery location: ${customer.location}`,
    customer.notes ? `Notes: ${customer.notes}` : null,
    "",
    "Items:",
    itemLines,
    "",
    `Total: KSh ${subtotal.toLocaleString()}`,
    "Payment: Pay on delivery",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function buildWhatsAppLink(phoneNumber: string, message: string) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoLink(email: string, message: string) {
  return `mailto:${email}?subject=${encodeURIComponent(
    "New Thomex order"
  )}&body=${encodeURIComponent(message)}`;
}
