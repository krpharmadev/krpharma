'use client';

import { usePlatformUser } from '@/hooks/usePlatformUser';
import Image from 'next/image';

export const UserProfile = () => {
  const { user, isLoading, isLoggedIn, login, logout, platform } = usePlatformUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <p className="text-gray-600">กรุณาเข้าสู่ระบบ</p>
        <button
          onClick={(_) => login()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          เข้าสู่ระบบ
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow">
      <div className="relative w-24 h-24 rounded-full overflow-hidden">
        {user?.picture ? (
          <Image
            src={user.picture}
            alt={user.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl text-gray-500">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold">{user?.name}</h2>
        {user?.email && <p className="text-gray-600">{user.email}</p>}
        <p className="text-sm text-gray-500">
          Platform: {platform === 'liff' ? 'LINE LIFF' : 'Web'}
        </p>
      </div>

      <button
        onClick={(_) => logout()}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        ออกจากระบบ
      </button>
    </div>
  );
}; 