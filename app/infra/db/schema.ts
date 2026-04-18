import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const photoConfig = pgTable("photo_configs", {
  id: text().primaryKey(),
  cols: integer(),
  rows: integer(),
});
