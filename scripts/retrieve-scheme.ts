import fs from "node:fs/promises";

process.loadEnvFile();

const baseUrl = process.env.VITE_IRIS_BASE_URL;
if (baseUrl == null) {
  console.error("[!] You need to specify VITE_IRIS_BASE_URL in '.env'!");
  process.exit(1);
}

const content = await fetch(`${baseUrl}/openapi.json`);
const text = await content.text();

if (!content.ok) {
  console.error("[!] The request to the Iris for OpenAPI schema has failed:");
  console.error(text);
  process.exit(2);
}

await fs.writeFile("./app/api/iris/openapi.json", text);

console.info("[ok] The Iris's OpenAPI json is stored");
