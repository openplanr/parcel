import { readFileSync } from "node:fs";

export interface ServiceConfig {
  port: number;
  defaultPageSize: number;
}

const DEFAULTS: ServiceConfig = { port: 3000, defaultPageSize: 20 };

/** Reads `config.local.json` when present; missing keys fall back to defaults. */
export function loadConfig(path = "config.local.json"): ServiceConfig {
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { ...DEFAULTS };
    }
    throw error;
  }
  const parsed = JSON.parse(raw) as Partial<ServiceConfig>;
  return { ...DEFAULTS, ...parsed };
}
