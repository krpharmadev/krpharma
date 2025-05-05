'use client';

import { usePlatformUser } from '@/hooks/usePlatformUser';
import Link from 'next/link';

export default function LinkAccountsPage() {
  const { user, isLoading, isLoggedIn, login, loginBoth, platform } = usePlatformUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-8">เชื่อมโยงบัญชี</h1>
        <div className="bg-white rounded-lg shadow p-8 max-w-md w-full">
          <p className="mb-6 text-center">กรุณาเข้าสู่ระบบเพื่อเชื่อมโยงบัญชีของคุณ</p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => login()}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              เข้าสู่ระบบด้วยอีเมล
            </button>
            <button
              onClick={() => loginBoth()}
              className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              เข้าสู่ระบบและเชื่อมโยงกับบัญชี LINE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-8">บัญชีของคุณ</h1>
      <div className="bg-white rounded-lg shadow p-8 max-w-md w-full mb-6">
        <div className="flex flex-col items-center">
          {user?.picture && (
            <img 
              src={user.picture} 
              alt={user.name} 
              className="w-24 h-24 rounded-full mb-4 object-cover" 
            />
          )}
          <h2 className="text-xl font-semibold mb-2">{user?.name}</h2>
          {user?.email && <p className="text-gray-600 mb-2">{user.email}</p>}
          <p className="text-gray-500 mb-4">แพลตฟอร์ม: {platform === 'liff' ? 'LINE' : 'เว็บ'}</p>
          
          <div className="w-full border-t border-gray-200 my-4 pt-4">
            <h3 className="text-lg font-medium mb-3">สถานะการเชื่อมโยง</h3>
            <div className="flex items-center mb-3">
              <div className={`w-4 h-4 rounded-full mr-2 ${user?.lineUserId ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>บัญชี LINE: {user?.lineUserId ? 'เชื่อมโยงแล้ว' : 'ยังไม่ได้เชื่อมโยง'}</span>
            </div>
            
            {!user?.lineUserId && (
              <button
                onClick={() => loginBoth()}
                className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                เชื่อมโยงกับบัญชี LINE
              </button>
            )}
          </div>
        </div>
      </div>
      
      <Link 
        href="/dashboard" 
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        ไปที่หน้าแดชบอร์ด
      </Link>
    </div>
  );
} 