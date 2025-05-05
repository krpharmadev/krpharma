'use server';

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { neon } from '@neondatabase/serverless';

// เชื่อมต่อกับฐานข้อมูล Neon PostgreSQL
const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

export async function POST(request: Request) {
  try {
    // ตรวจสอบว่ามี session หรือไม่
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต กรุณาเข้าสู่ระบบก่อน' },
        { status: 401 }
      );
    }

    // รับข้อมูลจาก request
    const { lineUserId } = await request.json();

    if (!lineUserId) {
      return NextResponse.json(
        { error: 'ไม่พบ LINE User ID' },
        { status: 400 }
      );
    }

    // อัพเดทข้อมูลผู้ใช้ในฐานข้อมูล
    const userId = session.user.id;
    await sql`
      UPDATE users 
      SET "lineUserId" = ${lineUserId} 
      WHERE id = ${userId}
    `;

    // อัพเดทข้อมูลใน accounts table ถ้าจำเป็น
    const accounts = await sql`
      SELECT * FROM accounts 
      WHERE "userId" = ${userId} AND provider = 'line'
    `;

    if (accounts.length === 0) {
      // ถ้ายังไม่มีข้อมูล LINE account ให้สร้างใหม่
      await sql`
        INSERT INTO accounts (
          "userId", 
          "provider", 
          "providerAccountId", 
          "type"
        ) VALUES (
          ${userId}, 
          'line', 
          ${lineUserId}, 
          'oauth'
        )
      `;
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error linking accounts:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเชื่อมโยงบัญชี' },
      { status: 500 }
    );
  }
} 