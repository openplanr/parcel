import { describe, expect, it } from "vitest";
import { ordersToCsv } from "../src/export.ts";
import type { Order } from "../src/orders.ts";

const order: Order = {
  id: "ord_0001",
  customer: "Lena Park",
  status: "paid",
  lines: [
    { sku: "MUG-01", quantity: 2, unitPriceCents: 1200 },
    { sku: "TEE-M", quantity: 1, unitPriceCents: 2500 },
  ],
  createdAt: "2026-10-01T09:00:00.000Z",
};

describe("ordersToCsv", () => {
  it("writes a header and one row per order", () => {
    expect(ordersToCsv([order])).toBe(
      "id,customer,status,items,total,created_at\n" +
        "ord_0001,Lena Park,paid,3,49.00,2026-10-01T09:00:00.000Z\n",
    );
  });

  it("quotes customer names that contain commas or quotes", () => {
    const csv = ordersToCsv([{ ...order, customer: 'Haddad, Omar "OJ"' }]);
    expect(csv.split("\n")[1]).toBe('ord_0001,"Haddad, Omar ""OJ""",paid,3,49.00,2026-10-01T09:00:00.000Z');
  });
});
