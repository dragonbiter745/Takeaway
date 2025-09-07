import type { Handler } from "@netlify/functions";
import { pool, setupDatabase } from './db';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    await setupDatabase();
    const { name, emailOrPhone } = JSON.parse(event.body || '{}');

    if (!name || !emailOrPhone) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Name and email/phone are required.' }) };
    }

    let user;
    const existingUser = await pool.query('SELECT * FROM users WHERE email_or_phone = $1', [emailOrPhone]);

    if (existingUser.rows.length > 0) {
      user = existingUser.rows[0];
    } else {
      const newUser = await pool.query(
        'INSERT INTO users (name, email_or_phone) VALUES ($1, $2) RETURNING *',
        [name, emailOrPhone]
      );
      user = newUser.rows[0];
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.error("Error in login function:", error);
    return { 
        statusCode: 500, 
        body: JSON.stringify({ message: 'Internal Server Error', error: (error as Error).message }) 
    };
  }
};
