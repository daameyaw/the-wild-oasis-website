import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

/**
 * Authentication configuration for the application using NextAuth.js with Google as the provider.
 *
 * Features:
 * - Google OAuth authentication (credentials from environment variables)
 * - Callbacks:
 *   - authorized: Checks if a user is authenticated before allowing access to protected pages
 *   - signIn: On sign-in, checks/creates a guest user in the database
 *   - session: Attaches the guest's ID to the session object
 * - Custom sign-in page at /login
 *
 * Exports:
 * - GET, POST: NextAuth API route handlers
 * - auth: Main authentication object
 * - signIn, signOut: Helper functions for authentication
 */

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [Google],
// });

/**
 * authConfig object for NextAuth.js
 *
 * Purpose:
 *   - Defines the authentication configuration for the application.
 *
 * Contains:
 *   - providers: List of authentication providers (Google in this case)
 *   - callbacks: Custom callback functions for authorization, sign-in, and session handling
 *   - pages: Custom routes for authentication-related pages (e.g., signIn)
 */
const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    /**
     * authorized callback for NextAuth.js
     *
     * Purpose:
     *   - Determines if a user is authorized to access a protected page.
     *   - Returns true if the user is authenticated, otherwise false.
     *
     * Parameters:
     *   - auth: The authentication object (contains user info if authenticated)
     *   - request: The request object (not used here)
     *
     * Returns:
     *   - true if the user is authenticated (access granted)
     *   - false if not authenticated (access denied, user is redirected to login)
     */
    authorized({ auth, request }) {
      // if(auth?.user) {
      //     return true
      // } else {
      //     return false
      // }
      return !!auth?.user;
    },

    /**
     * signIn callback for NextAuth.js
     *
     * Purpose:
     *   - Checks if the signing-in user exists in the database as a guest.
     *   - If not, creates a new guest entry with the user's email and name.
     *
     * Parameters:
     *   - user: The user object from the authentication provider (contains email, name, etc.)
     *   - account: The account object from the provider (not used here)
     *   - profile: The profile object from the provider (not used here)
     *
     * Returns:
     *   - true if sign-in is allowed (guest exists or is created successfully)
     *   - false if an error occurs (sign-in is denied)
     */
    async signIn({ user, account, profile }) {
      try {
        const exisitingGuest = await getGuest(user.email);

        if (!exisitingGuest) {
          await createGuest({
            email: user.email,
            fullName: user.name,
          });
        }
        return true;
      } catch {
        return false;
      }
    },
    /**
     * session callback for NextAuth.js
     *
     * Purpose:
     *   - Enhances the session object by attaching the guest's ID from the database to session.user.guestId.
     *
     * Parameters:
     *   - session: The current session object (contains user info from the provider)
     *   - user: The user object (from the authentication provider)
     *
     * Returns:
     *   - The modified session object with guestId included in session.user
     */
    async session({ session, user }) {
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;
      return session;
    },
  },
  /**
   * pages property for NextAuth.js
   *
   * Purpose:
   *   - Specifies custom routes for authentication-related pages.
   *   - Allows overriding default NextAuth.js pages (e.g., sign-in, sign-out, error pages).
   *
   * Usage:
   *   - signIn: Custom path for the sign-in page. Users who need to authenticate will be redirected to this route.
   *   - Additional custom pages (e.g., signOut, error) can be added as needed.
   *
   * Example:
   *   pages: {
   *     signIn: "/login", // Redirects unauthenticated users to /login
   *   }
   */
  pages: {
    signIn: "/login",
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
