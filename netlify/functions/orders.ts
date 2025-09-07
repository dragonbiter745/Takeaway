import type { Handler } from "@netlify/functions";
import { pool, setupDatabase } from './db';

export const handler: Handler = async (event) => {
  await setupDatabase();
  
  try {
    if (event.httpMethod === 'GET') {
      const userId = event.queryStringParameters?.userId;
      if (!userId) {
        return { statusCode: 400, body: JSON.stringify({ message: 'User ID is required.' }) };
      }

      const result = await pool.query(
        'SELECT * FROM orders WHERE user_id = $1 ORDER BY timestamp DESC',
        [parseInt(userId, 10)]
      );
      
      const orders = result.rows.map(order => ({
          ...order,
          timestamp: new Date(order.timestamp),
          pickupTime: new Date(order.pickup_time),
      }));

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orders),
      };
    }

    if (event.httpMethod === 'POST') {
      const { userId, order } = JSON.parse(event.body || '{}');
      if (!userId || !order) {
        return { statusCode: 400, body: JSON.stringify({ message: 'User ID and order data are required.' }) };
      }

      const { id, customerName, items, status, timestamp, pickupTime, total } = order;
      
      await pool.query(
        'INSERT INTO orders (id, user_id, customer_name, items, status, timestamp, pickup_time, total) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [id, userId, customerName, JSON.stringify(items), status, timestamp, pickupTime, total]
      );

      return {
        statusCode: 201,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      };
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
  } catch (error) {
    console.error("Error in orders function:", error);
    return { 
        statusCode: 500, 
        body: JSON.stringify({ message: 'Internal Server Error', error: (error as Error).message }) 
    };
  }
};
