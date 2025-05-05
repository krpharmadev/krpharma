'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // จำลองการโหลดสินค้าจาก API
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // ในโปรเจคจริงควรใช้ fetch จริงๆ
        // const response = await fetch('/api/products');
        // const data = await response.json();
        
        // ใช้ข้อมูลจำลองแทน
        const mockProducts = [
          {
            id: '1',
            name: 'พาราเซตามอล 500 มก.',
            description: 'ยาบรรเทาอาการปวด ลดไข้',
            price: 25,
            imageUrl: 'https://via.placeholder.com/150',
            category: 'medications',
          },
          {
            id: '2',
            name: 'วิตามินซี 1000 มก.',
            description: 'วิตามินซีเสริมภูมิคุ้มกัน',
            price: 150,
            imageUrl: 'https://via.placeholder.com/150',
            category: 'supplements',
          },
          {
            id: '3',
            name: 'แอลกอฮอล์ล้างมือ 450 มล.',
            description: 'แอลกอฮอล์ล้างมือฆ่าเชื้อโรค',
            price: 120,
            imageUrl: 'https://via.placeholder.com/150',
            category: 'healthcare',
          },
        ];
        
        setTimeout(() => {
          setProducts(mockProducts);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">หน้าหลัก</h1>
        {session?.user && (
          <p className="text-gray-600">
            ยินดีต้อนรับ, <span className="font-semibold">{session.user.name || 'ผู้ใช้'}</span>
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">คำสั่งซื้อล่าสุด</h2>
          <p className="text-gray-500">ยังไม่มีคำสั่งซื้อ</p>
          <Link 
            href="/orders" 
            className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
          >
            ดูคำสั่งซื้อทั้งหมด &rarr;
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">โปรไฟล์ของคุณ</h2>
          {session?.user ? (
            <div>
              <p className="text-gray-700 mb-1">ชื่อ: {session.user.name || '-'}</p>
              <p className="text-gray-700">อีเมล: {session.user.email || '-'}</p>
              <Link 
                href="/profile" 
                className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
              >
                แก้ไขโปรไฟล์ &rarr;
              </Link>
            </div>
          ) : (
            <p className="text-gray-500">กรุณาเข้าสู่ระบบเพื่อดูข้อมูลโปรไฟล์</p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">โปรโมชั่น</h2>
          <p className="text-gray-500">ส่วนลด 10% สำหรับการสั่งซื้อครั้งแรก</p>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">สินค้าแนะนำ</h2>
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">฿{product.price}</span>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">
                    เพิ่มลงตะกร้า
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 