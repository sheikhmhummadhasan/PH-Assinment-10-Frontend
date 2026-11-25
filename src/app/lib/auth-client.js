import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [adminClient()],
});
export const { signIn, signUp, signOut, useSession } = authClient;

// npx auth@latest create-admin --email hasan2001onlin@gmail.com --name "Hasan Admin" --role admin --config ./src/app/lib/auth.js