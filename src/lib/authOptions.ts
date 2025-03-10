import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import connection from "@/lib/db";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

const SECRET_KEY = process.env.JWT_SECRET || "mysecret";

interface CustomUser extends User {
  id: number;
  name: string;
  phone: string;
  image: string;
  role: string;
  shop_id?: number | null;
  isRegistered?: boolean;
}

interface CustomToken extends JWT {
  id: number;
  name: string;
  phone: string;
  image: string;
  role: string;
  shop_id?: number | null;
  accessToken: string;
}

interface CustomSession extends Session {
  user: {
    id: number;
    name: string;
    phone: string;
    image: string;
    role: string;
    shop_id?: number | null;
  };
  accessToken: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.phone || !credentials?.password) {
          console.log("⚠️ Missing phone or password");
          return null;
        }

        const query = `
          SELECT user_id AS id, name, phone, image, password, 'user' AS role, NULL AS shop_id FROM users WHERE phone = ? 
          UNION
          SELECT shop_id AS id, shop_name AS name, phone_number AS phone, shop_image AS image, password, 'shop' AS role, shop_id FROM shops WHERE phone_number = ? 
          LIMIT 1;
        `;
        const values = [credentials.phone, credentials.phone];
        const [results]: any = await connection.query(query, values);

        if (results.length === 0) {
          console.log("⚠️ ไม่พบผู้ใช้");
          return null;
        }

        const user = results[0];

        // 🔹 ตรวจสอบรหัสผ่านด้วย bcrypt
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          console.log("⚠️ รหัสผ่านไม่ถูกต้อง");
          return null;
        }

        return {
          id: Number(user.id),
          name: String(user.name),
          phone: String(user.phone),
          image: user.image ?? "",
          role: user.role,
          shop_id: user.shop_id ? Number(user.shop_id) : null,
          isRegistered: true,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.id = customUser.id;
        token.name = customUser.name;
        token.phone = customUser.phone;
        token.image = customUser.image ?? "";
        token.role = customUser.role;
        token.shop_id = customUser.shop_id ?? null;

        token.accessToken = jwt.sign(
          {
            id: customUser.id,
            phone: customUser.phone,
            role: customUser.role,
            shop_id: customUser.shop_id ?? null,
          },
          SECRET_KEY,
          { expiresIn: "4h" }
        );

        console.log("✅ JWT Token Generated:", token.accessToken);
      }

      return token;
    },

    async session({ session, token }) {
      const customToken = token as CustomToken;
      session.user = {
        id: customToken.id,
        name: customToken.name,
        phone: customToken.phone,
        image: customToken.image ?? "",
        role: customToken.role,
        shop_id: customToken.shop_id ?? null,
      };

      session.accessToken = customToken.accessToken;

      console.log("✅ Session Created:", session);
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
  secret: SECRET_KEY,
};
