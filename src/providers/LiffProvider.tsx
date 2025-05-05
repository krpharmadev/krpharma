'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import dynamic from 'next/dynamic';

// ประกาศ type แทนการ import ตรง ๆ เพื่อป้องกัน SSR errors
export interface LiffUser {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

interface LiffContextType {
  isLoading: boolean;
  isInitialized: boolean;
  isLoggedIn: boolean;
  user: LiffUser | null;
  error: Error | null;
  login: () => void;
  logout: () => void;
  liffObject: any | null;
}

// สร้าง default value ที่ปลอดภัยสำหรับ SSR
const defaultContextValue: LiffContextType = {
  isLoading: true,
  isInitialized: false,
  isLoggedIn: false,
  user: null,
  error: null,
  login: () => {},
  logout: () => {},
  liffObject: null,
};

const LiffContext = createContext<LiffContextType>(defaultContextValue);

interface LiffProviderProps {
  children: ReactNode;
  liffId?: string;
  autoLogin?: boolean;
}

export function LiffProvider({ children, liffId, autoLogin = true }: LiffProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<LiffUser | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [liffObject, setLiffObject] = useState<any | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);

  // ตรวจสอบว่ากำลังทำงานบน browser หรือไม่
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    // ไม่ทำงานหากไม่ได้อยู่บน browser
    if (!isBrowser) return;
    
    const effectiveLiffId = liffId || process.env.NEXT_PUBLIC_LIFF_ID;
    if (!effectiveLiffId) {
      setIsLoading(false);
      setError(new Error('LIFF ID is not provided'));
      return;
    }

    const initLiff = async () => {
      try {
        // โหลด LIFF SDK แบบ dynamic
        const liffModule = await import('@line/liff');
        const liff = liffModule.default;
        
        await liff.init({ liffId: effectiveLiffId });
        setLiffObject(liff);
        setIsInitialized(true);

        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setUser({
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
            statusMessage: profile.statusMessage,
          });
        } else if (autoLogin) {
          // เข้าสู่ระบบโดยอัตโนมัติเฉพาะเมื่ออยู่บน browser เท่านั้น
          liff.login();
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize LIFF'));
        console.error('LIFF initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initLiff();
  }, [isBrowser, liffId, autoLogin]);

  const login = () => {
    if (isInitialized && liffObject && !liffObject.isLoggedIn()) {
      liffObject.login();
    }
  };

  const logout = () => {
    if (isInitialized && liffObject && liffObject.isLoggedIn()) {
      liffObject.logout();
      setUser(null);
    }
  };

  const value = {
    isLoading,
    isInitialized,
    isLoggedIn: !!user,
    user,
    error,
    login,
    logout,
    liffObject,
  };

  return <LiffContext.Provider value={value}>{children}</LiffContext.Provider>;
}

export function useLiff() {
  const context = useContext(LiffContext);
  return context;
}

// Export LiffProvider แบบ client-only
export default dynamic(() => Promise.resolve(LiffProvider), { ssr: false }); 