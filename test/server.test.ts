import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { OrderStore } from "../src/orders.ts";
import { createApp } from "../src/server.ts";

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  const store = new OrderStore(() => new Date("2026-10-01T09:00:00Z"));
  for (const customer of ["Lena Park", "Omar Haddad", "Sofia Rossi"]) {
    store.create({ customer, lines: [{ sku: "MUG-01", quantity: 1, unitPriceCents: 1200 }] });
  }
  server = createServer(createApp(store, 2));
  await new Promise<void>((resolve) => server.listen(0, resolve));
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

describe("GET /orders", () => {
  it("returns the first page using the default page size", async () => {
    const res = await fetch(`${baseUrl}/orders`);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.items.map((o: { customer: string }) => o.customer)).toEqual(["Sofia Rossi", "Omar Haddad"]);
  });

  it("rejects page=0 with 400", async () => {
    const res = await fetch(`${baseUrl}/orders?page=0`);
    expect(res.status).toBe(400);
  });
});

describe("GET /orders/export.csv", () => {
  it("returns every order as CSV", async () => {
    const res = await fetch(`${baseUrl}/orders/export.csv`);
    const csv = await res.text();
    expect(res.headers.get("content-type")).toBe("text/csv; charset=utf-8");
    expect(csv.trim().split("\n")).toHaveLength(4);
  });
});
