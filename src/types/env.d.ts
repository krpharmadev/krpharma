declare namespace NodeJS {
  interface ProcessEnv {
    // สภาพแวดล้อมของ Next.js
    NODE_ENV: 'development' | 'production' | 'test';
    
    // URL ของ API
    NEXT_PUBLIC_API_URL?: string;
    
    // ID ของ LIFF สำหรับ LINE
    NEXT_PUBLIC_LIFF_ID?: string;
    
    // ข้อมูลสำหรับการเชื่อมต่อ LINE
    LINE_CHANNEL_ID?: string;
    LINE_CHANNEL_SECRET?: string;
    
    // ข้อมูลสำหรับ NextAuth
    NEXTAUTH_URL?: string;
    NEXTAUTH_SECRET?: string;
  }
} 