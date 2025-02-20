// app/api/log/rout.ts
import logger from '../../../lib/logger';

export async function GET(req: Request) {
  try {
    // บันทึก log ว่ามีการร้องขอ GET
    logger.info('Received GET request on /api/log');
    
    return new Response(JSON.stringify({ message: 'Log recorded successfully' }), { status: 200 });
  } catch (error) {
    // ตรวจสอบว่า error เป็น instance ของ Error หรือไม่
    if (error instanceof Error) {
      // บันทึก log ว่ามีข้อผิดพลาดเกิดขึ้น
      logger.error(`Error in /api/log: ${error.message}`);
    } else {
      // ถ้าไม่ใช่ Error class สามารถบันทึกได้ตามนี้
      logger.error('An unknown error occurred');
    }
    
    return new Response(JSON.stringify({ error: 'An error occurred' }), { status: 500 });
  }
}
