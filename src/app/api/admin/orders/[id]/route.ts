import { NextResponse } from 'next/server';
import connection from '@/lib/db';
import { FieldPacket } from 'mysql2';
import { authenticateToken } from '@/lib/middleware';

interface Params {
    params: {
      id: string;
    };
  }

export const PUT = async (request: Request, { params: { id } }: Params) => {
  

    try {
        // console.log("order_id", +id)
        
        const resultCompleted = await connection.query(
            'UPDATE orders SET deliveryTime=now(),status="Completed",is_rainy=0 WHERE order_id=?',
            [+id]
        
        );
        // const resultStatus = await connection.query(
        //     'UPDATE orders SET status=? WHERE order_id=?',
        //     [newStatus,+id]
        // );

      
        
          
        return NextResponse.json({ message: 'Order delivery successfully!' }, { status: 200 });
    } catch (error: unknown) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Error updating order', details: (error as Error).message }, { status: 500 });
    }
};
