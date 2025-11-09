import { createRemoteJWKSet, jwtVerify } from "jose";

const rawIssuer = process.env.AUTH0_ISSUER!;
const AUDIENCE = process.env.AUTH0_AUDIENCE!;

// ✅ Ensure issuer ends with a trailing slash
const ISSUER = rawIssuer.endsWith("/") ? rawIssuer : rawIssuer + "/";

// ✅ Load JWKS from Auth0
const JWKS = createRemoteJWKSet(
  new URL(`${ISSUER}.well-known/jwks.json`)
);

export async function verifyJwt(authHeader: string) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing Bearer token");
  }

  const token = authHeader.slice(7);

  // ✅ Verify token signature, issuer, audience
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: ISSUER,
    audience: AUDIENCE,
  });

  // ✅ Email verification check removed (as requested)
  // if (!payload.email_verified) {
  //   throw new Error("Email not verified");
  // }

  return payload; // Return claims (including country)
}
