import { drizzle } from "drizzle-orm/d1";

export function database(d1: D1Database) {
  return drizzle(d1);
}
