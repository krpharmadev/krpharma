'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

interface WebLayoutProps {
  children: ReactNode;
}

export default function WebLayout({ children }: WebLayoutProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/auth/signin' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="font-bold text-xl text-blue-600">KR Pharma</Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">หน้าหลัก</Link>
            <Link href="/orders" className="text-gray-700 hover:text-blue-600">คำสั่งซื้อ</Link>
            <Link href="/profile" className="text-gray-700 hover:text-blue-600">โปรไฟล์</Link>
          </nav>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700">สวัสดี, {session?.user?.name || 'ผู้ใช้'}</span>
                <button
                  onClick={handleSignOut}
                  className="text-sm px-3 py-1 rounded-md text-white bg-red-500 hover:bg-red-600"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <Link href="/auth/signin" className="text-gray-700 hover:text-blue-600">เข้าสู่ระบบ</Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">เกี่ยวกับเรา</h3>
              <p className="text-gray-300">KR Pharma เป็นร้านขายยาออนไลน์ที่ให้บริการจัดส่งยาและผลิตภัณฑ์เพื่อสุขภาพถึงบ้านคุณ</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">ลิงก์ด่วน</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="text-gray-300 hover:text-white">หน้าหลัก</Link></li>
                <li><Link href="/orders" className="text-gray-300 hover:text-white">คำสั่งซื้อ</Link></li>
                <li><Link href="/profile" className="text-gray-300 hover:text-white">โปรไฟล์</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">ติดต่อเรา</h3>
              <p className="text-gray-300">อีเมล: contact@krpharma.com</p>
              <p className="text-gray-300">โทร: 02-123-4567</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} KR Pharma. สงวนลิขสิทธิ์</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 