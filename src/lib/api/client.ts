/**
 * เรียกใช้ API โดยใช้ fetch
 * 
 * @param url URL ของ API ที่ต้องการเรียก
 * @param options ตัวเลือกสำหรับการ fetch
 * @returns Promise ที่ resolve เป็นข้อมูล JSON
 * @throws จะ throw exception หากเกิดข้อผิดพลาด
 */
export async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  const response = await fetch(fullUrl, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.error || 'เกิดข้อผิดพลาดในการเรียกใช้ API') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  
  return data as T;
}

// API functions สำหรับเรียกใช้ endpoints ต่างๆ

/**
 * ดึงรายการสินค้าทั้งหมด
 * 
 * @param params พารามิเตอร์สำหรับการกรองสินค้า
 * @returns Promise ที่ resolve เป็นรายการสินค้า
 */
export async function getProducts(params?: { category?: string; query?: string }) {
  const queryParams = new URLSearchParams();
  
  if (params?.category) {
    queryParams.set('category', params.category);
  }
  
  if (params?.query) {
    queryParams.set('query', params.query);
  }
  
  const queryString = queryParams.toString();
  const url = `/api/products${queryString ? `?${queryString}` : ''}`;
  
  return fetchApi<Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    stock: number;
  }>>(url);
}

/**
 * ดึงข้อมูลสินค้าโดย ID
 * 
 * @param id ID ของสินค้า
 * @returns Promise ที่ resolve เป็นข้อมูลสินค้า
 */
export async function getProductById(id: string) {
  return fetchApi<{
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    stock: number;
  }>(`/api/products/${id}`);
}

/**
 * ลงทะเบียนผู้ใช้ใหม่
 * 
 * @param userData ข้อมูลผู้ใช้
 * @returns Promise ที่ resolve เมื่อลงทะเบียนสำเร็จ
 */
export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
}) {
  return fetchApi<{ id: string; name: string; email: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * สร้างคำสั่งซื้อใหม่
 * 
 * @param orderData ข้อมูลคำสั่งซื้อ
 * @returns Promise ที่ resolve เมื่อสร้างคำสั่งซื้อสำเร็จ
 */
export async function createOrder(orderData: {
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: string;
}) {
  return fetchApi('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
} 