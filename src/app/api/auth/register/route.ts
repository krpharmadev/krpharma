import { NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { users } from '@/drizzle/schema';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าอีเมลถูกใช้งานแล้วหรือไม่
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    
    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: 'อีเมลนี้ถูกใช้งานแล้ว' },
        { status: 409 }
      );
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const newUser = await db.insert(users).values({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
    }).returning({ id: users.id, name: users.name, email: users.email });

    return NextResponse.json(
      { 
        message: 'ลงทะเบียนสำเร็จ', 
        user: {
          id: newUser[0].id,
          name: newUser[0].name,
          email: newUser[0].email
        } 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการลงทะเบียน' },
      { status: 500 }
    );
  }
} 