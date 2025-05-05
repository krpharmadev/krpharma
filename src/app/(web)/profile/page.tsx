'use client';

import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoading = status === 'loading';

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">โปรไฟล์ของฉัน</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="aspect-square rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user?.image ? (
                <img 
                  src={user.image} 
                  alt={user.name || 'User'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-gray-500">👤</span>
              )}
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ชื่อ</label>
                <p className="mt-1 text-lg">{user?.name || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">อีเมล</label>
                <p className="mt-1 text-lg">{user?.email || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">รหัสผู้ใช้</label>
                <p className="mt-1 text-lg">{user?.id || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                <p className="mt-1 text-lg">-</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ที่อยู่</label>
                <p className="mt-1 text-lg">-</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 