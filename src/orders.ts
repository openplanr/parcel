export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export interface OrderLine {
  sku: string;
  quantity: number;
  unitPriceCents: number;
}

export interface Order {
  id: string;
  customer: string;
  status: OrderStatus;
  lines: OrderLine[];
  createdAt: string;
}

export interface NewOrder {
  customer: string;
  lines: OrderLine[];
}

export class OrderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderValidationError";
  }
}

export function orderTotalCents(order: Pick<Order, "lines">): number {
  return order.lines.reduce((sum, line) => sum + line.quantity * line.unitPriceCents, 0);
}

export class OrderStore {
  private readonly orders: Order[] = [];
  private nextId = 1;
  private readonly now: () => Date;

  constructor(now: () => Date = () => new Date()) {
    this.now = now;
  }

  create(input: NewOrder): Order {
    if (input.customer.trim() === "") {
      throw new OrderValidationError("customer must not be empty");
    }
    if (input.lines.length === 0) {
      throw new OrderValidationError("an order needs at least one line");
    }
    const order: Order = {
      id: `ord_${String(this.nextId++).padStart(4, "0")}`,
      customer: input.customer.trim(),
      status: "pending",
      lines: input.lines.map((line) => ({ ...line })),
      createdAt: this.now().toISOString(),
    };
    this.orders.push(order);
    return order;
  }

  get(id: string): Order | undefined {
    return this.orders.find((order) => order.id === id);
  }

  list(status?: OrderStatus): Order[] {
    const newestFirst = [...this.orders].reverse();
    return status ? newestFirst.filter((order) => order.status === status) : newestFirst;
  }

  setStatus(id: string, status: OrderStatus): Order {
    const order = this.get(id);
    if (!order) {
      throw new OrderValidationError(`no order with id ${id}`);
    }
    order.status = status;
    return order;
  }
}
