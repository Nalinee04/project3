import NextAuth from "next-auth";
import authOptions from "@/lib/authOptions"; // ✅ ใช้ default import

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
