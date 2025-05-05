'use client';

import { useState, useEffect } from 'react';
import { initializeLiff, isLoggedIn, getLINEProfile, login, logout } from '@/lib/line/liff';

// กำหนด LIFF ID สำหรับแอปพลิเคชัน (ต้องเปลี่ยนเป็น ID จริงเมื่อใช้งาน)
const LIFF_ID = 'your-liff-id';

interface LINEProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export function useLiff() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedInLiff, setIsLoggedInLiff] = useState(false);
  const [profile, setProfile] = useState<LINEProfile | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const liff = await initializeLiff(LIFF_ID);
        
        if (liff) {
          setIsInitialized(true);
          const loginStatus = isLoggedIn();
          setIsLoggedInLiff(loginStatus);
          
          if (loginStatus) {
            const userProfile = await getLINEProfile();
            setProfile(userProfile);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('เกิดข้อผิดพลาดในการเริ่มต้น LIFF'));
        console.error('LIFF initialization error', err);
      } finally {
        setIsLoading(false);
      }
    };

    // เริ่มต้นเฉพาะเมื่ออยู่บนเบราว์เซอร์เท่านั้น
    if (typeof window !== 'undefined') {
      init();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginWithLINE = () => {
    if (!isInitialized) {
      setError(new Error('LIFF ยังไม่ได้เริ่มต้น'));
      return;
    }
    login();
  };

  const logoutFromLINE = () => {
    if (!isInitialized) {
      setError(new Error('LIFF ยังไม่ได้เริ่มต้น'));
      return;
    }
    logout();
    setIsLoggedInLiff(false);
    setProfile(null);
  };

  return {
    isLoading,
    isInitialized,
    isLoggedIn: isLoggedInLiff,
    profile,
    error,
    login: loginWithLINE,
    logout: logoutFromLINE,
  };
} 