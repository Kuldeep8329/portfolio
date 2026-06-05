const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

let pool;
if (databaseUrl) {
  pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 4000 // 4 seconds timeout
  });

  // Log on initial connection attempt
  pool.connect((err, client, release) => {
    if (err) {
      console.warn('DB Connection Notice: Could not connect to database directly. Using local JSON files as fallback. Error:', err.message);
    } else {
      console.log('Database connection pool established successfully!');
      release();
    }
  });
} else {
  console.warn('DB Connection Notice: DATABASE_URL not defined in .env. Using local JSON files.');
}

const query = async (text, params) => {
  if (!pool) {
    throw new Error('Database connection pool is not initialized.');
  }
  return pool.query(text, params);
};

const checkConnection = async () => {
  if (!pool) return false;
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = {
  query,
  checkConnection,
  getPool: () => pool
};
