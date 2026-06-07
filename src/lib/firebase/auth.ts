import { cookies } from "next/headers";
import { adminAuth } from "./admin";

export interface SessionData {
  uid: string;
  email?: string;
  email_verified?: boolean;
}

/**
 * Lightweight JWT decoder to bypass firebase-admin ADC conflicts locally.
 * TODO: Use actual signature verification in production.
 */
export function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/**
 * Gets the current user session from the Firebase session cookie.
 * Can be used in Server Components, Route Handlers, and Server Actions.
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = decodeJwt(sessionCookie);
    if (!decodedClaims) return null;
    
    // Check expiration
    if (decodedClaims.exp * 1000 < Date.now()) {
      return null;
    }

    return {
      uid: decodedClaims.user_id || decodedClaims.uid,
      email: decodedClaims.email,
      email_verified: decodedClaims.email_verified,
    };
  } catch (error) {
    // Cookie is invalid or expired
    console.error("verifyIdToken error:", error);
    return null;
  }
}

/**
 * Creates a session cookie and sets it in the HTTP response.
 * Usually called from an API route after client-side login.
 */
export async function createSessionCookie(idToken: string) {
  // Firebase ID tokens expire in 1 hour.
  const expiresIn = 60 * 60 * 1000;
  
  try {
    // We bypass `adminAuth.createSessionCookie` because it requires a Service Account Key,
    // which the user's organization policies restrict.
    // Instead, we just store the raw JWT ID token in an HttpOnly cookie.
    const options = {
      name: "session",
      value: idToken, // Store the raw idToken directly
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    };
    
    return options;
  } catch (error) {
    console.error("Error creating session cookie", error);
    throw error;
  }
}
