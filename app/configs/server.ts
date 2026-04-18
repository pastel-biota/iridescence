import z from "zod/v4";

export const envSchema = z.looseObject({
  PG_USER: z.string(),
  PG_HOST: z.string(),
  PG_PORT: z.coerce.number(),
  PG_DATABASE: z.string(),
  PG_PASSWORD: z.string(),
});

export function loadEnv(): z.infer<typeof envSchema> {
  return envSchema.parse(process.env);
}
