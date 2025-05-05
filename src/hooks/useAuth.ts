'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getCsrfToken } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  // ฟังก์ชันสำหรับดึง session token เพื่อใช้กับ API (CSRF token ใช้เป็นตัวแทน)
  const getSessionToken = async () => {
    const token = await getCsrfToken();
    return token || '';
  };

  // ฟังก์ชันอัพเดท session
  const updateSession = async () => {
    return await update();
  };

  // ฟังก์ชันเข้าสู่ระบบพร้อมระบุ callbackUrl
  const login = async (callbackUrl?: string) => {
    return await signIn(undefined, { callbackUrl });
  };

  // ฟังก์ชันออกจากระบบ
  const logout = async (callbackUrl = '/auth/signin') => {
    return await signOut({ redirect: true, callbackUrl });
  };

  return {
    user: session?.user ?? null,
    isLoading: status === 'loading',
    isLoggedIn: status === 'authenticated',
    login,
    logout,
    getSessionToken,
    updateSession,
  };
}; 