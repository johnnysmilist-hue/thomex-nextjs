export type OrderItem = {
  name: string;
  qty: number;
  price: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "dispatched"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  location: string;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  payment_method: "delivery" | "mpesa";
  payment_status: "unpaid" | "paid";
  mpesa_checkout_id: string | null;
  status: OrderStatus;
};
