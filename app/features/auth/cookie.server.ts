import { COOKIE_DOMAIN } from "~/configs/server.server";

const COOKIE_NAME = "iris-secret";

export function resolveCookieDomain(host: string): string | undefined {
  const hostname = host.split(":")[0] ?? host;

  return COOKIE_DOMAIN.find(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  );
}

export function setCookie(
  token: string,
  options: { host: string; secure: boolean },
): string {
  const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const domain = resolveCookieDomain(options.host);

  const attributes = [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    `Expires=${expiration.toUTCString()}`,
    "SameSite=Strict",
    "HttpOnly",
  ];

  if (domain) {
    attributes.push(`Domain=${domain}`);
  }

  if (options.secure) {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

/**
 * Reads the raw session token out of an incoming request's `Cookie` header.
 * Returns undefined when the session cookie is absent.
 */
export function getSessionToken(request: Request): string | undefined {
  const header = request.headers.get("cookie");
  if (header == null) {
    return undefined;
  }

  for (const part of header.split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (name === COOKIE_NAME) {
      return value.join("=");
    }
  }

  return undefined;
}

/**
 * Builds the outgoing headers needed to forward the caller's session to the
 * Iris backend from a server-side loader/action. The browser attaches the
 * cookie automatically via `credentials: "include"`, but server-to-server
 * fetches have no cookie jar, so the session must be forwarded explicitly.
 *
 * Only the `iris-secret` cookie is forwarded — never the caller's entire
 * cookie jar — so unrelated cookies on the shared apex domain don't leak to
 * the backend.
 */
export function forwardSessionCookie(
  request: Request,
): Record<string, string> | undefined {
  const token = getSessionToken(request);
  if (token == null) {
    return undefined;
  }

  return { Cookie: `${COOKIE_NAME}=${token}` };
}
