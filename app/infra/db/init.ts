import { drizzle } from "drizzle-orm/node-postgres";

import { loadEnv } from "~/configs/server";

export type IrisDatabase = ReturnType<typeof database>;

export function database() {
  const env = loadEnv();
  return drizzle({
    connection: {
      host: env.PG_HOST,
      port: env.PG_PORT,
      user: env.PG_USER,
      database: env.PG_DATABASE,
      password: env.PG_PASSWORD,
    },
  });
}
