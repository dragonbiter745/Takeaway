import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createTablesQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email_or_phone VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(255) PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    customer_name VARCHAR(255) NOT NULL,
    items JSONB NOT NULL,
    status VARCHAR(50) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    pickup_time TIMESTAMPTZ NOT NULL,
    total NUMERIC(10, 2) NOT NULL
  );
`;

let dbInitialized = false;

export async function setupDatabase() {
  if (dbInitialized) return;
  try {
    await pool.query(createTablesQuery);
    dbInitialized = true;
    console.log("Database tables are set up.");
  } catch (error) {
    console.error("Error setting up database tables:", error);
    throw error;
  }
}
