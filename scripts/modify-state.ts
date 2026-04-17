import childProcess from "node:child_process";

import z from "zod";

process.loadEnvFile();

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

async function runSQL(sql: string) {
  console.log(`Executing the SQL on the D1:\n${sql}`);

  const executed = await new Promise<number | null>((res, rej) => {
    const process = childProcess.spawn(
      "pnpm",
      ["wrangler", "d1", "execute", "db", "--local", "--command", sql],
      { stdio: "inherit" },
    );

    process.on("exit", (exit) => {
      res(exit);
    });
    process.on("error", (error) => {
      rej(error);
    });
  });

  console.log(`The command exited with ${executed?.toString() ?? "?"}`);
}

async function gridCommand(args: GridArgumentSchema) {
  switch (args[1]) {
    case "set": {
      const [id, cols, rows] = [args[2], args[3], args[4]];
      const colText = cols.toString();
      const rowText = rows.toString();
      await runSQL(`
        INSERT INTO photo_configs (id, cols, rows) VALUES ('${id}', ${colText}, ${rowText})
        ON CONFLICT(id) DO UPDATE SET rows=excluded.rows, cols=excluded.cols
      `);
      break;
    }
    case "unset": {
      const id = args[2];
      await runSQL(`DELETE FROM photo_configs WHERE id == '${id}'`);
      break;
    }
    case "list": {
      await runSQL(`SELECT * FROM photo_configs;`);
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

  switch (args.data[0]) {
    case "grid":
      await gridCommand(args.data);
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
