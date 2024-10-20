import { NextApiRequest, NextApiResponse } from 'next';
import { getUserById } from '@/lib/user'; // ตรวจสอบให้แน่ใจว่าเส้นทางถูกต้อง

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    try {
      const user = await getUserById(Number(id)); // แปลง id เป็น number
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ message: 'Error fetching user' });
    }
  } else {
    // ถ้าไม่ใช่ GET
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
