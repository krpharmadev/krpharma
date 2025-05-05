'use client';

/**
 * ตรวจสอบว่าเป็น LIFF context หรือไม่
 * 
 * @returns boolean แสดงว่าเป็น LIFF context หรือไม่
 */
export function isLiffEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    // ตรวจจากตำแหน่งปัจจุบัน
    const isLiffPath = window.location.pathname.startsWith('/liff');
    
    // ตรวจจาก User-Agent
    const userAgent = navigator.userAgent || '';
    const isLineApp = userAgent.includes('Line') || userAgent.includes('LIFF');
    
    return isLiffPath || isLineApp;
  } catch (_) {
    // ป้องกันกรณีเรียกใช้ใน environment ที่ไม่มี window หรือ navigator
    return false;
  }
}

/**
 * ตรวจสอบว่า LIFF กำลังทำงานอยู่ภายใน LINE app หรือไม่
 * 
 * @param liffObject ออบเจ็กต์ LIFF ที่เริ่มต้นแล้ว
 * @returns boolean แสดงว่าทำงานอยู่ใน LINE app หรือไม่
 */
export function isInLineApp(liffObject: any): boolean {
  if (typeof window === 'undefined' || !liffObject) return false;
  
  try {
    return liffObject.isInClient();
  } catch (error) {
    console.error('Error checking if in LINE app:', error);
    return false;
  }
}

/**
 * ส่งข้อความกลับไปที่ LINE Chat (ใช้ได้เมื่ออยู่ใน LINE app เท่านั้น)
 * 
 * @param liffObject ออบเจ็กต์ LIFF ที่เริ่มต้นแล้ว
 * @param message ข้อความที่ต้องการส่ง
 * @returns boolean แสดงว่าส่งสำเร็จหรือไม่
 */
export function sendLineMessage(liffObject: any, message: string): boolean {
  if (typeof window === 'undefined' || !liffObject || !isInLineApp(liffObject)) return false;
  
  try {
    liffObject.sendMessages([{ type: 'text', text: message }]);
    return true;
  } catch (error) {
    console.error('ไม่สามารถส่งข้อความได้:', error);
    return false;
  }
}

/**
 * ปิดหน้าต่าง LIFF (ใช้ได้เมื่ออยู่ใน LINE app เท่านั้น)
 * 
 * @param liffObject ออบเจ็กต์ LIFF ที่เริ่มต้นแล้ว
 * @returns boolean แสดงว่าดำเนินการสำเร็จหรือไม่
 */
export function closeWindow(liffObject: any): boolean {
  if (typeof window === 'undefined' || !liffObject || !isInLineApp(liffObject)) return false;
  
  try {
    liffObject.closeWindow();
    return true;
  } catch (error) {
    console.error('ไม่สามารถปิดหน้าต่างได้:', error);
    return false;
  }
}

/**
 * ดึง ID ของผู้ใช้ LINE
 * 
 * @param liffObject ออบเจ็กต์ LIFF ที่เริ่มต้นแล้ว
 * @returns Promise ที่ resolve เป็น ID ของผู้ใช้ LINE หรือ null ถ้าไม่สำเร็จ
 */
export async function getLineUserId(liffObject: any): Promise<string | null> {
  if (typeof window === 'undefined' || !liffObject) return null;
  
  try {
    if (!liffObject.isLoggedIn()) return null;
    const profile = await liffObject.getProfile();
    return profile?.userId || null;
  } catch (error) {
    console.error('ไม่สามารถดึง ID ของผู้ใช้ได้:', error);
    return null;
  }
} 