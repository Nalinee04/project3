import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import connection from "@/lib/db";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// กำหนด SECRET_KEY สำหรับการเซ็น JWT
const SECRET_KEY = process.env.JWT_SECRET || "mysecret";

// กำหนด Interface สำหรับผู้ใช้
interface CustomUser extends User {
  id: number;
  name: string;
  phone: string;
  image: string;
  role: string;
  shop_id?: number | null; // ✅ รองรับ null
  isRegistered?: boolean;
}

// กำหนด Interface สำหรับ Token ที่เก็บข้อมูลผู้ใช้
interface CustomToken extends JWT {
  id: number;
  name: string;
  phone: string;
  image: string;
  role: string;
  shop_id?: number | null; // ✅ รองรับ null
  accessToken?: string;
}

// กำหนด Interface สำหรับ Session ที่จะส่งให้ในแต่ละคำขอ
interface CustomSession extends Session {
  user: {
    id: number;
    name: string;
    phone: string;
    image: string;
    role: string;
    shop_id?: number | null; // ✅ รองรับ null
  };
  accessToken?: string;
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
          throw new Error("Missing phone or password");
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
          throw new Error("ไม่พบผู้ใช้ สมัครบัญชีเลย");
        }

        const user = results[0];

        if (user.role === "shop") {
          return {
            id: Number(user.id),
            name: String(user.name),
            phone: String(user.phone),
            image: user.image ?? "",
            role: user.role,
            shop_id: user.shop_id ? Number(user.shop_id) : null, // ✅ ใช้ null
            isRegistered: true,
          };
        } else {
          const checkUserQuery =
            "SELECT COUNT(*) AS userExists FROM users WHERE phone = ?";
          const [checkResults]: any = await connection.query(checkUserQuery, [
            credentials.phone,
          ]);
          const isRegistered = checkResults[0].userExists > 0;

          return {
            id: Number(user.id),
            name: String(user.name),
            phone: String(user.phone),
            image: user.image ?? "",
            role: user.role,
            shop_id: user.shop_id ? Number(user.shop_id) : null, // ✅ ใช้ null
            isRegistered: isRegistered,
          };
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',  // ชื่อ cookie ที่จะใช้เก็บ session
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",  // ใช้ secure cookie ใน production
        sameSite: 'Lax',  // ป้องกันการส่ง cookie จาก cross-site request
        path: '/', // ใช้ path ทั้งหมด
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
        token.shop_id = customUser.shop_id ?? null; // ✅ ใช้ null

        token.accessToken = jwt.sign(
          {
            id: customUser.id,
            phone: customUser.phone,
            role: customUser.role,
            shop_id: customUser.shop_id ?? null, // ✅ ใช้ null
          },
          process.env.JWT_SECRET as string,
          { expiresIn: "4h" }
        );
        console.log("🔑 JWT Token Generated:", token);
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
        shop_id: customToken.shop_id ?? null, // ✅ ใช้ null
      };

      session.accessToken = customToken.accessToken ?? "";

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
  secret: SECRET_KEY,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
