export function expectEnv(name: string): string {
  const value = process.env[name];

  if (value == null || value === "") {
    throw new Error(`Environment variable ${name} was not provided via .env`);
  }

  return value;
}

export const COOKIE_DOMAIN = expectEnv("COOKIE_DOMAIN").split(",");
