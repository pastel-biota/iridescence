export const MEMBRANE_BASE_URL = import.meta.env.VITE_MEMBRANE_BASE_URL as
  | string
  | undefined;

if (MEMBRANE_BASE_URL == null || MEMBRANE_BASE_URL === "") {
  throw new Error(
    "Environment variable MEMBRANE_BASE_URL was not provided on build time",
  );
}
