import { NextRequest, NextResponse } from 'next/server';

// ข้อมูลสินค้าจำลอง (ในโปรเจคจริงควรเก็บในฐานข้อมูล)
const mockProducts = [
  {
    id: '1',
    name: 'พาราเซตามอล 500 มก.',
    description: 'ยาบรรเทาอาการปวด ลดไข้',
    price: 25,
    imageUrl: '/images/products/paracetamol.jpg',
    category: 'medications',
    stock: 100,
  },
  {
    id: '2',
    name: 'วิตามินซี 1000 มก.',
    description: 'วิตามินซีเสริมภูมิคุ้มกัน',
    price: 150,
    imageUrl: '/images/products/vitamin-c.jpg',
    category: 'supplements',
    stock: 50,
  },
  {
    id: '3',
    name: 'แอลกอฮอล์ล้างมือ 450 มล.',
    description: 'แอลกอฮอล์ล้างมือฆ่าเชื้อโรค',
    price: 120,
    imageUrl: '/images/products/hand-sanitizer.jpg',
    category: 'healthcare',
    stock: 75,
  },
  {
    id: '4',
    name: 'ยาแก้แพ้ลอราทาดีน',
    description: 'ยาแก้แพ้ บรรเทาอาการคัน',
    price: 35,
    imageUrl: '/images/products/loratadine.jpg',
    category: 'medications',
    stock: 60,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('query');
  
  let filteredProducts = [...mockProducts];
  
  // กรองตามหมวดหมู่ถ้ามีการระบุ
  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }
  
  // กรองตามคำค้นหาถ้ามีการระบุ
  if (query) {
    const searchQuery = query.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery) || 
      product.description.toLowerCase().includes(searchQuery)
    );
  }
  
  return NextResponse.json(filteredProducts);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: 'ต้องระบุชื่อสินค้าและราคา' }, 
        { status: 400 }
      );
    }
    
    // ในโปรเจคจริงจะบันทึกลงฐานข้อมูล
    const newProduct = {
      id: (mockProducts.length + 1).toString(),
      ...body,
      stock: body.stock || 0
    };
    
    // จำลองการเพิ่มสินค้า
    mockProducts.push(newProduct);
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างสินค้า' }, 
      { status: 500 }
    );
  }
} 