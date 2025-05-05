'use client';

import { useLiff } from '@/providers/LiffProvider';
import { closeWindow, sendLineMessage } from '@/lib/line/utils';
import { useState, useEffect } from 'react';

export default function LiffDemoPage() {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { isLoading, isInitialized, isLoggedIn, user, error, login, logout, liffObject } = useLiff();
  const [message, setMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // ป้องกัน hydration error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSendMessage = () => {
    if (message && liffObject) {
      sendLineMessage(liffObject, message);
      setMessage('');
    }
  };

  const handleCloseWindow = () => {
    if (liffObject) {
      closeWindow(liffObject);
    }
  };

  // แสดงเนื้อหาเมื่อ mounted บน client แล้วเท่านั้น
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isInClient = liffObject?.isInClient?.();

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
        <h1 className="text-2xl font-bold mb-4">LIFF Demo</h1>
        <p className="mb-4">กรุณาเข้าสู่ระบบเพื่อใช้งาน LIFF</p>
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
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">LIFF Demo</h1>
      
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">ข้อมูลผู้ใช้</h2>
        <div className="flex items-center space-x-4">
          {user?.pictureUrl && (
            <img 
              src={user.pictureUrl} 
              alt={user.displayName} 
              className="h-16 w-16 rounded-full"
            />
          )}
          <div>
            <p className="font-medium">{user?.displayName}</p>
            <p className="text-sm text-gray-600">User ID: {user?.userId}</p>
            {user?.statusMessage && (
              <p className="text-sm text-gray-600">Status: {user?.statusMessage}</p>
            )}
          </div>
        </div>
      </div>
      
      {isInClient && (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">ส่งข้อความ</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border rounded px-2 py-1"
              placeholder="พิมพ์ข้อความ..."
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ส่ง
            </button>
          </div>
        </div>
      )}
      
      <div className="flex space-x-2">
        {isInClient && (
          <button
            onClick={handleCloseWindow}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            ปิดหน้าต่าง
          </button>
        )}
        
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
} 