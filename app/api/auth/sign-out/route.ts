
export async function POST() {
  const response = new Response(
    JSON.stringify({ success: true }),
    { headers: { "Content-Type": "application/json" } }
  );

  // remove cookies do Better Auth
  response.headers.append(
    "Set-Cookie",
    "better-auth.session-token=; Path=/; Max-Age=0"
  );
  response.headers.append(
    "Set-Cookie",
    "__Secure-better-auth.session-token=; Path=/; Max-Age=0; Secure"
  );

  return response;
}
