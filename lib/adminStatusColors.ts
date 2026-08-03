import type { OrderStatus } from "@/lib/orderTypes";

export const STATUS_BADGE_COLORS: Record<OrderStatus, string> = {
  pending: "bg-[#f0b849] text-[#1d2327]",
  confirmed: "bg-[#2271b1] text-white",
  dispatched: "bg-[#2271b1] text-white",
  delivered: "bg-[#00a32a] text-white",
  cancelled: "bg-[#d63638] text-white",
};
