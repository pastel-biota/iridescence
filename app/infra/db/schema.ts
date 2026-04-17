import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const photoConfig = sqliteTable("photo_configs", {
  id: text().primaryKey(),
  cols: integer(),
  rows: integer(),
});
