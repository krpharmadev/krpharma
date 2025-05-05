'use client';

import { useAuth } from './useAuth';
import { useLiff } from '@/providers/LiffProvider';
import { useEffect, useState } from 'react';

export type PlatformUser = {
  id: string;
  name: string;
  email?: string;
  picture?: string;
  platform: 'web' | 'liff';
  lineUserId?: string;
};

// ฟังก์ชันเพื่อเรียก API สำหรับการเชื่อมโยงบัญชี
async function linkAccounts(lineUserId: string, sessionToken: string) {
  try {
    const result = await fetch('/api/auth/link-accounts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      },
      body: JSON.stringify({ lineUserId }),
    });
    return await result.json();
  } catch (error) {
    console.error('Error linking accounts:', error);
    return null;
  }
}

export const usePlatformUser = () => {
  const webAuth = useAuth();
  const liffAuth = useLiff();
  const [isLinking, setIsLinking] = useState(false);

  // ตรวจสอบว่าเป็น LIFF context หรือไม่
  const isLiff = typeof window !== 'undefined' && window.location.pathname.startsWith('/liff');

  // เลือกใช้ auth context ตาม platform
  const auth = isLiff ? {
    user: liffAuth.user,
    isLoading: liffAuth.isLoading,
    isLoggedIn: liffAuth.isLoggedIn,
    login: liffAuth.login,
    logout: liffAuth.logout
  } : webAuth;

  // แปลง user data ให้เป็นรูปแบบเดียวกัน
  const user: PlatformUser | null = auth.user
    ? {
        id: isLiff ? liffAuth.user!.userId : webAuth.user!.id,
        name: isLiff ? liffAuth.user!.displayName : webAuth.user!.name || '',
        email: isLiff ? undefined : webAuth.user!.email || undefined,
        picture: isLiff ? liffAuth.user!.pictureUrl : webAuth.user!.image || undefined,
        platform: isLiff ? 'liff' : 'web',
        lineUserId: isLiff ? liffAuth.user!.userId : webAuth.user!.lineUserId,
      }
    : null;

  // พยายามเชื่อมโยงบัญชีอัตโนมัติเมื่อมีข้อมูลทั้งสองระบบ
  useEffect(() => {
    // ไม่ต้องทำอะไรถ้ากำลัง loading หรือกำลัง linking อยู่แล้ว
    if (auth.isLoading || isLinking) return;

    // เมื่อล็อกอินทั้ง web และ liff แล้ว แต่ยังไม่ได้เชื่อมโยงกัน
    if (webAuth.isLoggedIn && liffAuth.isLoggedIn && 
        liffAuth.user && !webAuth.user?.lineUserId) {
      const linkAccountsAsync = async () => {
        setIsLinking(true);
        
        try {
          // ดึง session token จาก cookie หรือ state management อื่นๆ
          const sessionToken = await webAuth.getSessionToken?.() || '';
          if (sessionToken) {
            await linkAccounts(liffAuth.user!.userId, sessionToken);
            // รีโหลด session เพื่ออัพเดทข้อมูลผู้ใช้
            webAuth.updateSession?.();
          }
        } catch (error) {
          console.error('Error linking accounts:', error);
        } finally {
          setIsLinking(false);
        }
      };
      
      linkAccountsAsync();
    }
  }, [webAuth.isLoggedIn, liffAuth.isLoggedIn, webAuth.user, liffAuth.user, auth.isLoading, isLinking]);

  // เพิ่มฟังก์ชันสำหรับการล็อกอินทั้งสองระบบ
  const loginBoth = async () => {
    // ล็อกอินที่ web ก่อน (อาจใช้หน้า modal หรือ popup)
    await webAuth.login();
    
    // จากนั้นล็อกอินที่ LINE
    liffAuth.login();
  };

  return {
    user,
    isLoading: auth.isLoading || isLinking,
    isLoggedIn: auth.isLoggedIn,
    login: auth.login,
    loginBoth,
    logout: auth.logout,
    platform: isLiff ? 'liff' : 'web',
  };
}; 