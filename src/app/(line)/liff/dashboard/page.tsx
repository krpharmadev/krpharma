'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LiffDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // TODO: เชื่อมต่อกับ LIFF SDK เมื่อคอมโพเนนต์ถูกโหลด
    const initializeLiff = async () => {
      try {
        // จำลองการโหลด LIFF
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize LIFF', error);
        setIsLoading(false);
      }
    };
    
    initializeLiff();
  }, []);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">สวัสดี คุณผู้ใช้</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link href="/liff/orders" className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span className="text-sm font-medium">คำสั่งซื้อของฉัน</span>
        </Link>
        
        <Link href="/liff/profile" className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-sm font-medium">โปรไฟล์</span>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">คำสั่งซื้อล่าสุด</h2>
        <p className="text-gray-500 text-center py-4">ยังไม่มีคำสั่งซื้อ</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">สินค้าแนะนำ</h2>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-gray-100 rounded p-3 flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mb-2"></div>
              <span className="text-sm font-medium">สินค้า {item}</span>
              <span className="text-xs text-gray-500">฿XX.XX</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 