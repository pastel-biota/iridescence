import { eq } from "drizzle-orm";
import z from "zod";

import { photoConfig } from "~/infra/db/schema.js";

import { database, type IrisDatabase } from "../app/infra/db/init.js";

process.loadEnvFile(".env");

const argumentsSchema = z.union([
  z.tuple([
    z.literal("grid"),
    z.literal("set"),
    z.string().min(1),
    z.coerce.number().min(1).max(2),
    z.coerce.number().min(1).max(2),
  ]),
  z.tuple([z.literal("grid"), z.literal("unset"), z.string().min(1)]),
  z.tuple([z.literal("grid"), z.literal("list")]),
  z.tuple([z.literal("help")]),
]);

type ArgumentSchema = z.infer<typeof argumentsSchema>;
type GridArgumentSchema = ArgumentSchema & ["grid", ...unknown[]];

async function gridCommand(db: IrisDatabase, args: GridArgumentSchema) {
  switch (args[1]) {
    case "set": {
      const [id, cols, rows] = [args[2], args[3], args[4]];

      await db
        .insert(photoConfig)
        .values({ id, cols, rows })
        .onConflictDoUpdate({
          target: photoConfig.id,
          set: { cols, rows },
        });

      const configs = await db
        .select()
        .from(photoConfig)
        .where(eq(photoConfig.id, id));

      console.table(configs);
      break;
    }
    case "unset": {
      const id = args[2];
      await db.delete(photoConfig).where(eq(photoConfig.id, id));

      break;
    }
    case "list": {
      const configs = await db.select().from(photoConfig);

      console.table(configs);

      break;
    }
  }
}

function writeHelp() {
  console.log("Usage:");
  for (const cmd of argumentsSchema._zod.def.options) {
    const help: string[] = ["$"];
    for (const arg of cmd._zod.def.items) {
      switch (arg._zod.def.type) {
        case "literal":
          help.push(arg._zod.def.values[0] ?? "");
          break;
        default:
          help.push(arg._zod.def.type);
          break;
      }
    }
    console.log("  ", help.join(" "));
  }
}

async function main() {
  const args = argumentsSchema.safeParse(process.argv.slice(2));

  if (!args.success) {
    console.log("[!] The argument is not in the right schema.");
    console.log(JSON.stringify(z.treeifyError(args.error), undefined, 2));
    return;
  }

  const db = database();

  switch (args.data[0]) {
    case "grid":
      await gridCommand(db, args.data);
      return;
    case "help":
      writeHelp();
      return;
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  });
