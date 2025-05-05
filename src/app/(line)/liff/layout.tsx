'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { LiffProvider } from '@/providers/LiffProvider';

// ใช้ NoSSR wrapper component สำหรับ children
const NoSSR = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// สร้าง NoSSR component แบบ dynamic ที่ไม่ render บน server
const DynamicNoSSR = dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
});

export default function LiffLayout({ children }: { children: React.ReactNode }) {
  return (
    <DynamicNoSSR>
      <LiffProvider>
        <div className="liff-container">
          {children}
        </div>
      </LiffProvider>
    </DynamicNoSSR>
  );
} 