require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const db = require('../config/db');

async function syncExperience() {
  console.log('Synchronizing experience from JSON to database...');
  try {
    const isDbConnected = await db.checkConnection();
    if (!isDbConnected) {
      console.warn('Database is not reachable. Sync skipped. Ensure DATABASE_URL is set.');
      process.exit(0);
    }

    const expFilePath = path.join(__dirname, '../data/experience.json');
    const data = await fs.readFile(expFilePath, 'utf8');
    const experiences = JSON.parse(data);

    for (const item of experiences) {
      // Check if id exists
      const checkRes = await db.query('SELECT id FROM experience WHERE id = $1', [item.id]);
      if (checkRes.rows.length > 0) {
        // Update existing row
        await db.query(
          `UPDATE experience 
           SET role = $1, company = $2, location = $3, period = $4, highlights = $5 
           WHERE id = $6`,
          [item.role, item.company, item.location, item.period, item.highlights, item.id]
        );
        console.log(`Updated experience ID ${item.id} (${item.role} at ${item.company}) in database.`);
      } else {
        // Insert new row
        await db.query(
          `INSERT INTO experience (id, role, company, location, period, highlights) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [item.id, item.role, item.company, item.location, item.period, item.highlights]
        );
        console.log(`Inserted experience ID ${item.id} (${item.role} at ${item.company}) into database.`);
      }
    }
    console.log('Database synchronization completed successfully.');
  } catch (error) {
    console.error('Error synchronizing experience to database:', error);
  } finally {
    const pool = db.getPool();
    if (pool) {
      await pool.end();
    }
    process.exit(0);
  }
}

syncExperience();
