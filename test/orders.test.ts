import { describe, expect, it } from "vitest";
import { OrderStore, OrderValidationError, orderTotalCents } from "../src/orders.ts";

const fixedClock = () => new Date("2026-10-01T09:00:00Z");

describe("OrderStore", () => {
  it("creates pending orders with sequential ids", () => {
    const store = new OrderStore(fixedClock);
    const first = store.create({ customer: "Lena Park", lines: [{ sku: "MUG-01", quantity: 2, unitPriceCents: 1200 }] });
    const second = store.create({ customer: "Omar Haddad", lines: [{ sku: "TEE-M", quantity: 1, unitPriceCents: 2500 }] });

    expect(first.id).toBe("ord_0001");
    expect(second.id).toBe("ord_0002");
    expect(first.status).toBe("pending");
    expect(first.createdAt).toBe("2026-10-01T09:00:00.000Z");
  });

  it("rejects an empty customer and an order with no lines", () => {
    const store = new OrderStore(fixedClock);
    expect(() => store.create({ customer: "  ", lines: [{ sku: "MUG-01", quantity: 1, unitPriceCents: 1200 }] })).toThrow(OrderValidationError);
    expect(() => store.create({ customer: "Lena Park", lines: [] })).toThrow(OrderValidationError);
  });

  it("lists newest first and filters by status", () => {
    const store = new OrderStore(fixedClock);
    const a = store.create({ customer: "A", lines: [{ sku: "X", quantity: 1, unitPriceCents: 100 }] });
    store.create({ customer: "B", lines: [{ sku: "X", quantity: 1, unitPriceCents: 100 }] });
    store.setStatus(a.id, "paid");

    expect(store.list().map((o) => o.customer)).toEqual(["B", "A"]);
    expect(store.list("paid").map((o) => o.customer)).toEqual(["A"]);
  });
});

describe("orderTotalCents", () => {
  it("sums quantity times unit price", () => {
    expect(
      orderTotalCents({
        lines: [
          { sku: "MUG-01", quantity: 2, unitPriceCents: 1200 },
          { sku: "TEE-M", quantity: 1, unitPriceCents: 2500 },
        ],
      }),
    ).toBe(4900);
  });
});
