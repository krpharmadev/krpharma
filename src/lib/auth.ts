// auth.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import LineProvider from 'next-auth/providers/line';
import { DefaultSession } from 'next-auth';
import NeonAdapter from "@auth/neon-adapter";
import { neon } from '@neondatabase/serverless';
import { Pool } from '@neondatabase/serverless';
import { compare } from 'bcryptjs';

// 1. ขยาย Type ให้รองรับ id ที่เราต้องการใช้
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      lineUserId?: string;
    } & DefaultSession['user'];
  }
  
  interface User {
    id: string;
    lineUserId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    lineUserId?: string;
  }
}

// สร้าง connection กับ Neon PostgreSQL
const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const sql = neon(connectionString);

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.id = user.id;
        
        // เก็บ LINE userId จาก LINE provider
        if (account?.provider === 'line' && account?.providerAccountId) {
          token.lineUserId = account.providerAccountId;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token) {
        session.user.id = token.id;
        // ส่งต่อ lineUserId ไปยัง session เพื่อให้ใช้ในแอพได้
        if (token.lineUserId) {
          session.user.lineUserId = token.lineUserId;
        }
      }
      return session;
    },
    // เชื่อมโยง account หากพบว่าอีเมลเดียวกัน
    signIn: async ({ user, account, profile }) => {
      if (account?.provider === 'line' && profile?.email) {
        // ค้นหาผู้ใช้ที่มีอีเมลเดียวกับที่ได้จาก LINE
        try {
          const existingUser = await sql`
            SELECT * FROM users WHERE email = ${profile.email}
          `;
          
          if (existingUser && existingUser.length > 0) {
            // อัพเดทข้อมูล lineUserId ให้กับผู้ใช้ที่มีอยู่แล้ว
            await sql`
              UPDATE users 
              SET "lineUserId" = ${account.providerAccountId} 
              WHERE email = ${profile.email}
            `;
          }
        } catch (error) {
          console.error("Error linking accounts:", error);
        }
      }
      return true;
    },
    authorized: ({ auth, request }) => {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      
      // ให้เข้าถึงหน้า public ได้โดยไม่ต้อง login
      const isPublicPage = 
        pathname === '/auth/signin' || 
        pathname === '/auth/register' || 
        pathname === '/auth/error' ||
        pathname.startsWith('/liff');  // อนุญาตให้เข้าถึงทุกหน้า /liff/* โดยไม่ต้อง login
      
      // หากผู้ใช้ยังไม่ login แต่พยายามเข้าหน้าที่ต้อง login
      if (!isLoggedIn && !isPublicPage) {
        return false;
      }
      
      return true;
    }
  },
  adapter: NeonAdapter(pool),
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'profile openid email',
          bot_prompt: 'normal'
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'อีเมล', type: 'email' },
        password: { label: 'รหัสผ่าน', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // ค้นหาผู้ใช้จากฐานข้อมูล
          const users = await sql`
            SELECT * FROM users WHERE email = ${credentials.email}
          `;
          
          if (users && users.length > 0) {
            const user = users[0];
            
            // ตรวจสอบว่ามีรหัสผ่านและเป็น string หรือไม่
            if (!user.password || typeof user.password !== 'string') {
              console.error('Invalid password format');
              return null;
            }
            
            // ใช้ bcryptjs เปรียบเทียบรหัสผ่าน
            const isPasswordValid = await compare(credentials.password.toString(), user.password);
            
            if (isPasswordValid) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                lineUserId: user.lineUserId
              };
            }
          }
        } catch (error) {
          console.error("Auth error:", error);
        }

        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 วัน
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  }
});