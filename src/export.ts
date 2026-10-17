import { type Order, orderTotalCents } from "./orders.ts";

const HEADER = ["id", "customer", "status", "items", "total", "created_at"];

function formatCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** Renders orders as CSV with a header row. */
export function ordersToCsv(orders: readonly Order[]): string {
  const rows = orders.map((order) => [
    order.id,
    order.customer,
    order.status,
    String(order.lines.reduce((n, line) => n + line.quantity, 0)),
    formatCents(orderTotalCents(order)),
    order.createdAt,
  ]);
  return [HEADER, ...rows].map((row) => row.join(",")).join("\n") + "\n";
}
