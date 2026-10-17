# parcel

A small orders API. It keeps orders in memory, lists them a page at a time, and exports them as CSV.

It's the sample project used in OpenPlanr's videos and posts: small enough to read in one sitting, with real tests and a real backlog.

## Run it

Needs Node 22.6 or later (the server runs the TypeScript sources directly).

```sh
npm intsall
npm test
npm start
```

The server listens on port 3000 and starts with three demo orders.

## Endpoints

| Method | Path | What it returns |
|---|---|---|
| GET | `/orders?page=1&pageSize=20&status=paid` | One page of orders, newest first. `status` is optional. |
| GET | `/orders/export.csv` | Every order as CSV, one row per order |

## Layout

| File | What it does |
|---|---|
| `src/orders.ts` | Order types, totals, and the in-memory `OrderStore` |
| `src/pagination.ts` | `paginate()`: 1-based pages with `totalPages` and `hasNext` |
| `src/export.ts` | `ordersToCsv()`, with quoting for commas and quotes |
| `src/config.ts` | Reads `config.local.json` (`port`, `defaultPageSize`) |
| `src/server.ts` | The HTTP routes |

## Configuration

Copy `config.example.json` to `config.local.json` and change what you need. Without it the service uses port 3000 and 20 orders per page.

## License

MIT
