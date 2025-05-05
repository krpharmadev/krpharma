'use client';

import { useLiff } from '@/providers/LiffProvider';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function LiffProfilePage() {
  const { isLoading, isLoggedIn, user, login, logout, error } = useLiff();
  const [isMounted, setIsMounted] = useState(false);

  // ป้องกัน hydration error โดยไม่แสดงเนื้อหาจนกว่าจะ mount บน client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // แสดงแค่ loading หรือไม่แสดงอะไรเลยจนกว่าจะ mount บน client
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>เกิดข้อผิดพลาดในการโหลด LIFF: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">โปรไฟล์ LINE</h1>
        <p className="mb-4">กรุณาเข้าสู่ระบบเพื่อดูข้อมูลโปรไฟล์</p>
        <button 
          onClick={login}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          เข้าสู่ระบบด้วย LINE
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-8">โปรไฟล์ LINE</h1>
      
      <div className="bg-white rounded-lg shadow p-6 max-w-md w-full mb-6">
        <div className="flex flex-col items-center">
          {user?.pictureUrl ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
              <Image 
                src={user.pictureUrl} 
                alt={user.displayName} 
                fill
                sizes="(max-width: 768px) 100vw, 96px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <span className="text-2xl text-gray-500">
                {user?.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          <h2 className="text-xl font-semibold">{user?.displayName}</h2>
          
          {user?.statusMessage && (
            <p className="text-gray-600 mt-2 text-center">
              "{user.statusMessage}"
            </p>
          )}
          
          <p className="text-gray-500 mt-2 text-sm">User ID: {user?.userId}</p>
        </div>
      </div>
      
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        ออกจากระบบ
      </button>
    </div>
  );
} 