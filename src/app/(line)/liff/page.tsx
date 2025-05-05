'use client';

import React from 'react';
import { useLiff } from '@/providers/LiffProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';

export default function LiffHomePage() {
  const { isLoading, isLoggedIn, user, login, error } = useLiff();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">เกิดข้อผิดพลาด</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error.message}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.location.reload()}>ลองใหม่</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">ยินดีต้อนรับสู่ KR Pharma</CardTitle>
            <CardDescription className="text-center">กรุณาเข้าสู่ระบบเพื่อใช้งาน</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={login}>เข้าสู่ระบบด้วย LINE</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center min-h-screen">
      <Card className="w-full max-w-md mb-6">
        <CardHeader>
          <CardTitle className="text-center">ยินดีต้อนรับสู่ KR Pharma</CardTitle>
          <CardDescription className="text-center">บริการเภสัชกรรมออนไลน์</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {user?.pictureUrl && (
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Image 
                src={user.pictureUrl} 
                alt={user.displayName} 
                fill 
                className="object-cover"
              />
            </div>
          )}
          <h3 className="text-xl font-semibold">{user?.displayName}</h3>
          {user?.statusMessage && (
            <p className="text-gray-500 text-center">{user.statusMessage}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <Link href="/liff/profile" className="w-full">
          <Card className="h-full transition-transform hover:scale-105">
            <CardHeader>
              <CardTitle className="text-center">โปรไฟล์</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
            </CardContent>
          </Card>
        </Link>

        <Link href="/liff/dashboard" className="w-full">
          <Card className="h-full transition-transform hover:scale-105">
            <CardHeader>
              <CardTitle className="text-center">แดชบอร์ด</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 9h6v6H9z" />
                <path d="M6 6h.01" />
                <path d="M6 12h.01" />
                <path d="M6 18h.01" />
                <path d="M12 6h.01" />
                <path d="M18 6h.01" />
                <path d="M12 18h.01" />
                <path d="M18 12h.01" />
                <path d="M18 18h.01" />
              </svg>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
} 