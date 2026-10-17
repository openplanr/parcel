import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { loadConfig } from "./config.ts";
import { ordersToCsv } from "./export.ts";
import { type OrderStatus, OrderStore } from "./orders.ts";
import { paginate } from "./pagination.ts";

const STATUSES: readonly OrderStatus[] = ["pending", "paid", "shipped", "cancelled"];

function parseStatus(value: string | null): OrderStatus | undefined {
  return STATUSES.find((status) => status === value);
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

export function createApp(store: OrderStore, defaultPageSize: number) {
  return (req: IncomingMessage, res: ServerResponse): void => {
    const url = new URL(req.url ?? "/", "http://localhost");

    if (req.method === "GET" && url.pathname === "/orders") {
      const page = Number(url.searchParams.get("page") ?? 1);
      const pageSize = Number(url.searchParams.get("pageSize") ?? defaultPageSize);
      try {
        sendJson(res, 200, paginate(store.list(parseStatus(url.searchParams.get("status"))), page, pageSize));
      } catch (error) {
        if (error instanceof RangeError) {
          sendJson(res, 400, { error: error.message });
          return;
        }
        throw error;
      }
      return;
    }

    if (req.method === "GET" && url.pathname === "/orders/export.csv") {
      res.writeHead(200, {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="orders.csv"',
      });
      res.end(ordersToCsv(store.list()));
      return;
    }

    sendJson(res, 404, { error: `no route for ${req.method} ${url.pathname}` });
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const config = loadConfig();
  const store = new OrderStore();
  store.create({ customer: "Lena Park", lines: [{ sku: "MUG-01", quantity: 2, unitPriceCents: 1200 }] });
  store.create({ customer: "Haddad, Omar", lines: [{ sku: "TEE-M", quantity: 1, unitPriceCents: 2500 }] });
  store.create({ customer: "Sofia Rossi", lines: [{ sku: "CAP-BLK", quantity: 3, unitPriceCents: 1800 }] });
  createServer(createApp(store, config.defaultPageSize)).listen(config.port, () => {
    console.log(`order-service listening on http://localhost:${config.port}`);
  });
}
