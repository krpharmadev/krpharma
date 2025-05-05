'use client';

declare global {
  interface Window {
    liff: any;
  }
}

let liffObject: any = null;

/**
 * เริ่มต้นการทำงานของ LIFF SDK
 * 
 * @param liffId ID ของ LIFF application
 * @returns Promise ที่ resolve เมื่อเริ่มต้น LIFF SDK สำเร็จ
 */
export async function initializeLiff(liffId: string) {
  // ตรวจสอบว่ากำลังทำงานบนเบราว์เซอร์
  if (typeof window === 'undefined') return null;

  try {
    // โหลด LIFF SDK
    const liff = (await import('@line/liff')).default;
    
    if (!liffObject) {
      await liff.init({ liffId });
      liffObject = liff;
    }
    
    return liffObject;
  } catch (error) {
    console.error('LIFF SDK initialization failed:', error);
    throw error;
  }
}

/**
 * ตรวจสอบสถานะการเข้าสู่ระบบของผู้ใช้ LINE
 * 
 * @returns true หากผู้ใช้ได้เข้าสู่ระบบ LINE แล้ว
 */
export function isLoggedIn() {
  if (!liffObject) return false;
  return liffObject.isLoggedIn();
}

/**
 * ดึงข้อมูลโปรไฟล์ของผู้ใช้ LINE
 * 
 * @returns Promise ที่ resolve เป็นข้อมูลโปรไฟล์ LINE
 */
export async function getLINEProfile() {
  if (!liffObject || !isLoggedIn()) return null;
  
  try {
    const profile = await liffObject.getProfile();
    return profile;
  } catch (error) {
    console.error('Failed to get LINE profile:', error);
    return null;
  }
}

/**
 * เข้าสู่ระบบด้วย LINE
 */
export function login() {
  if (!liffObject) return;
  liffObject.login();
}

/**
 * ออกจากระบบ LINE
 */
export function logout() {
  if (!liffObject) return;
  liffObject.logout();
}

/**
 * ส่งข้อความกลับไปยัง LINE Chat
 * 
 * @param message ข้อความที่ต้องการส่ง
 */
export function sendMessage(message: string) {
  if (!liffObject || !liffObject.isInClient()) return;
  
  liffObject.sendMessages([
    {
      type: 'text',
      text: message,
    },
  ]);
}

/**
 * ปิดหน้าต่าง LIFF
 */
export function closeLIFF() {
  if (!liffObject || !liffObject.isInClient()) return;
  liffObject.closeWindow();
} 