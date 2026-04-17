export function json(status: number, object: object): Response {
  return new Response(JSON.stringify(object), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
