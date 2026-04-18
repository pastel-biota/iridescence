import { defineConfig } from "drizzle-kit";
import { loadEnv } from "~/configs/server";

const env = loadEnv();

export default defineConfig({
  out: "./.drizzle",
  schema: "./app/infra/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: env.PG_HOST,
    port: env.PG_PORT,
    user: env.PG_USER,
    database: env.PG_DATABASE,
    password: env.PG_PASSWORD,
  },
});
