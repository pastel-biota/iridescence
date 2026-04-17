export function expectEnv(content: string | undefined, name: string): string {
  if (content == null || content === "") {
    throw new Error(
      `Environment variable ${name} was not provided on build time`,
    );
  }

  return content;
}

export const MEMBRANE_BASE_URL = expectEnv(
  import.meta.env.VITE_MEMBRANE_BASE_URL as string | undefined,
  "VITE_MEMBRANE_BASE_URL",
);

export const IRIDESCENCE_BASE_URL = expectEnv(
  import.meta.env.VITE_IRIDESCENCE_BASE_URL as string | undefined,
  "VITE_IRIDESCENCE_BASE_URL",
);
