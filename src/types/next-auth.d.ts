import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * ขยาย interface User เพื่อรองรับ id
   */
  interface User {
    id: string;
  }

  /**
   * ขยาย interface Session เพื่อรองรับ id ของผู้ใช้
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  /**
   * ขยาย interface JWT เพื่อรองรับ id
   */
  interface JWT {
    id: string;
  }
}