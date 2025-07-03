import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getConnection } from "../../../framework/lib/db";
import { Account, Profile, User } from "next-auth";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account: Account | null;
      profile?: Profile;
    }): Promise<boolean> {
      try {
        const pool = await getConnection();

        const existingUser = await pool
          .request()
          .input("email", user.email)
          .query("SELECT * FROM Iftekhari.IftekhariUsers WHERE Email = @email");

        if (existingUser.recordset.length === 0) {
          await pool
            .request()
            .input("ProviderId", account?.providerAccountId || "")
            .input("Name", user.name || "")
            .input("Email", user.email || "")
            .input("ImageUrl", user.image || "")
            .input("Role", "user") // Default role
            .input("LastLogin", new Date()).query(`
              INSERT INTO Iftekhari.IftekhariUsers (ProviderId, Name, Email, ImageUrl, Role, LastLogin)
              VALUES (@ProviderId, @Name, @Email, @ImageUrl, @Role, @LastLogin)
            `);
        } else {
          await pool
            .request()
            .input("email", user.email)
            .input("LastLogin", new Date()).query(`
              UPDATE Iftekhari.IftekhariUsers SET LastLogin = @LastLogin WHERE Email = @email
            `);
        }

        return true;
      } catch (error) {
        console.error("Error logging login time:", error);
        return true;
      }
    },
    async jwt({ token, user }) {
      // Include role in JWT token
      if (user?.email) {
        try {
          const pool = await getConnection();
          const userRecord = await pool
            .request()
            .input("email", user.email)
            .query("SELECT Role FROM Iftekhari.IftekhariUsers WHERE Email = @email");
          
          if (userRecord.recordset.length > 0) {
            token.role = userRecord.recordset[0].Role;
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          token.role = "user"; // Default role
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Include role in session
      if (token.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
