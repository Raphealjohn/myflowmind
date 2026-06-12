import "server-only";

import { timingSafeEqual, createHash } from "node:crypto";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/**
 * Single founder account, credentials from env. No self-service signup —
 * the dashboard has exactly one user.
 */
export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Founder",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        if (!email || !password || !credentials) return null;
        if (
          safeEqual(credentials.email.toLowerCase(), email.toLowerCase()) &&
          safeEqual(credentials.password, password)
        ) {
          return { id: "founder", email, name: "Rapheal John" };
        }
        return null;
      },
    }),
  ],
};
