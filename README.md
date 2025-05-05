# KR Pharma

KR Pharma เป็นแอปพลิเคชันอีคอมเมิร์ซสำหรับร้านขายยาออนไลน์ พัฒนาด้วย Next.js 15, TailwindCSS v4, และ shadcn/ui ซึ่งรองรับการใช้งาน 2 รูปแบบ:

1. เว็บแอปพลิเคชัน (Web App)
2. LINE LIFF (LINE Front-end Framework)

## คุณสมบัติ

- การยืนยันตัวตนด้วย Email และรหัสผ่าน (NextAuth v5)
- การยืนยันตัวตนผ่าน LINE
- การแสดงรายการสินค้า
- การค้นหาและกรองสินค้า
- ระบบตะกร้าสินค้า
- ระบบสั่งซื้อสินค้า
- ประวัติการสั่งซื้อ
- โปรไฟล์ผู้ใช้งาน

## โครงสร้างโปรเจค

- `src/app/(web)` - เว็บแอปพลิเคชัน
- `src/app/(line)` - LINE LIFF แอปพลิเคชัน
- `src/app/api` - API endpoints
- `src/components` - Reusable components
- `src/lib` - Utility functions และ shared logic
  - `src/lib/auth.ts` - การตั้งค่า NextAuth v5
- `src/hooks` - React hooks
  - `src/hooks/useAuth.ts` - Custom hook สำหรับ auth
  - `src/hooks/useLiff.ts` - Custom hook สำหรับ LINE LIFF
- `src/types` - TypeScript types
- `src/middleware.ts` - Middleware สำหรับป้องกันหน้าที่ต้องเข้าสู่ระบบ

## การติดตั้ง

1. โคลนโปรเจค:

```bash
git clone https://github.com/yourusername/krpharma.git
cd krpharma
```

2. ติดตั้ง dependencies:

```bash
pnpm install
```

3. สร้างไฟล์ `.env.local` และกำหนดค่าตัวแปรสภาพแวดล้อม:

```
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# LINE LIFF
NEXT_PUBLIC_LIFF_ID=your-liff-id-here

# LINE Channel
LINE_CHANNEL_ID=your-channel-id-here
LINE_CHANNEL_SECRET=your-channel-secret-here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
```

4. เริ่มการพัฒนา:

```bash
pnpm dev
```

แอปพลิเคชันจะทำงานที่ `http://localhost:3000`

## การใช้งาน NextAuth v5

โปรเจคนี้ใช้ NextAuth v5 สำหรับการจัดการการยืนยันตัวตน โดยมีการตั้งค่าหลักใน `src/lib/auth.ts` โดยรองรับ:

- การเข้าสู่ระบบด้วย Credentials (email/password)
- การเข้าสู่ระบบด้วย JWT
- Middleware สำหรับป้องกันหน้าที่ต้องเข้าสู่ระบบ
- Type safety เต็มรูปแบบด้วย TypeScript

### บัญชีทดสอบ

- อีเมล: test@example.com
- รหัสผ่าน: password

## การสร้าง LIFF App

1. สร้าง LINE LIFF App ได้ที่ [LINE Developer Console](https://developers.line.biz/)
2. ดำเนินการตามขั้นตอนการสร้าง LIFF App และคัดลอก LIFF ID มากำหนดใน `.env.local`
3. กำหนด Endpoint URL เป็น `http://localhost:3000/liff` สำหรับการพัฒนา

## การปรับใช้งาน (Deployment)

1. สร้างเวอร์ชันการผลิต:

```bash
pnpm build
```

2. เริ่มใช้งานเวอร์ชันการผลิต:

```bash
pnpm start
```

## เทคโนโลยีที่ใช้

- [Next.js 15](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextAuth v5](https://next-auth.js.org/)
- [LINE LIFF SDK](https://developers.line.biz/en/docs/liff/)
