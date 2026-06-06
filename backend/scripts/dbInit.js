const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const db = require('../config/db');

// Secure password hashing helper
function hashPassword(password) {
  const salt = 'kuldeep_salt_8329';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Read JSON data files helper
const readJsonFile = async (filename) => {
  const filePath = path.join(__dirname, '../data', filename);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.warn(`File ${filename} not found or empty during seeding.`);
    return null;
  }
};

const ddlQueries = [
  // Profile
  `CREATE TABLE IF NOT EXISTS profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    summary TEXT,
    languages TEXT[],
    resume_link TEXT
  )`,
  
  // Skills
  `CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    items TEXT[] NOT NULL
  )`,
  
  // Experience
  `CREATE TABLE IF NOT EXISTS experience (
    id SERIAL PRIMARY KEY,
    role VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    period VARCHAR(100) NOT NULL,
    highlights TEXT[] NOT NULL
  )`,
  
  // Projects
  `CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tech TEXT[] NOT NULL,
    link VARCHAR(255),
    github VARCHAR(255)
  )`,
  
  // Education
  `CREATE TABLE IF NOT EXISTS education (
    id SERIAL PRIMARY KEY,
    degree VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    period VARCHAR(100) NOT NULL,
    details TEXT
  )`,
  
  // Certifications
  `CREATE TABLE IF NOT EXISTS certifications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    date VARCHAR(50) NOT NULL,
    description TEXT,
    link VARCHAR(255)
  )`,
  
  // Awards
  `CREATE TABLE IF NOT EXISTS awards (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    date VARCHAR(50) NOT NULL,
    description TEXT
  )`,
  
  // Contacts (Leads)
  `CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  
  // Admin users
  `CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`
];

async function initializeDatabase() {
  console.log('Starting database schema initialization...');
  
  try {
    const isDbConnected = await db.checkConnection();
    if (!isDbConnected) {
      console.warn('DB Init aborted: Database is not reachable. Ensure DATABASE_URL is correct and network supports IPv6/IPv4 pooler.');
      return false;
    }
    
    // 1. Run DDL queries
    for (const ddl of ddlQueries) {
      await db.query(ddl);
    }
    console.log('Database tables verified/created successfully.');

    // 2. Seed Admin Users if empty
    const adminCheck = await db.query('SELECT count(*) FROM admin_users');
    if (parseInt(adminCheck.rows[0].count, 10) === 0) {
      const defaultPasswordHash = hashPassword('admin123');
      await db.query(
        'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
        ['admin', defaultPasswordHash]
      );
      console.log('Admin user table seeded with default account (admin/admin123).');
    }

    // 3. Seed Profile if empty
    const profileCheck = await db.query('SELECT count(*) FROM profile');
    if (parseInt(profileCheck.rows[0].count, 10) === 0) {
      const data = await readJsonFile('profile.json');
      if (data) {
        await db.query(
          `INSERT INTO profile (name, role, location, email, phone, summary, languages) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [data.name, data.role, data.location, data.email, data.phone, data.summary, data.languages]
        );
        console.log('Profile table seeded successfully.');
      }
    }

    // 4. Seed Skills if empty
    const skillsCheck = await db.query('SELECT count(*) FROM skills');
    if (parseInt(skillsCheck.rows[0].count, 10) === 0) {
      const data = await readJsonFile('skills.json');
      if (data && data.length > 0) {
        for (const item of data) {
          await db.query('INSERT INTO skills (category, items) VALUES ($1, $2)', [item.category, item.items]);
        }
        console.log('Skills table seeded successfully.');
      }
    }

    // 5. Seed Experience if empty
    const expCheck = await db.query('SELECT count(*) FROM experience');
    if (parseInt(expCheck.rows[0].count, 10) === 0) {
      const data = await readJsonFile('experience.json');
      if (data && data.length > 0) {
        for (const item of data) {
          await db.query(
            'INSERT INTO experience (role, company, location, period, highlights) VALUES ($1, $2, $3, $4, $5)',
            [item.role, item.company, item.location, item.period, item.highlights]
          );
        }
        console.log('Experience table seeded successfully.');
      }
    }

    // 6. Seed Projects if empty
    const projectsCheck = await db.query('SELECT count(*) FROM projects');
    if (parseInt(projectsCheck.rows[0].count, 10) === 0) {
      const data = await readJsonFile('projects.json');
      if (data && data.length > 0) {
        for (const item of data) {
          await db.query(
            'INSERT INTO projects (title, description, tech, link, github) VALUES ($1, $2, $3, $4, $5)',
            [item.title, item.description, item.tech, item.link, item.github]
          );
        }
        console.log('Projects table seeded successfully.');
      }
    }

    // 7. Seed Education if empty
    const eduCheck = await db.query('SELECT count(*) FROM education');
    if (parseInt(eduCheck.rows[0].count, 10) === 0) {
      const data = await readJsonFile('education.json');
      if (data && data.length > 0) {
        for (const item of data) {
          await db.query(
            'INSERT INTO education (degree, institution, location, period, details) VALUES ($1, $2, $3, $4, $5)',
            [item.degree, item.institution, item.location, item.period, item.details]
          );
        }
        console.log('Education table seeded successfully.');
      }
    }

    // 8. Seed Certifications if empty
    const certsCheck = await db.query('SELECT count(*) FROM certifications');
    if (parseInt(certsCheck.rows[0].count, 10) === 0) {
      const data = await readJsonFile('certifications.json');
      if (data && data.length > 0) {
        for (const item of data) {
          await db.query(
            'INSERT INTO certifications (name, issuer, date, description, link) VALUES ($1, $2, $3, $4, $5)',
            [item.name, item.issuer, item.date, item.description, item.link]
          );
        }
        console.log('Certifications table seeded successfully.');
      }
    }

    // 9. Seed Awards if empty
    const awardsCheck = await db.query('SELECT count(*) FROM awards');
    if (parseInt(awardsCheck.rows[0].count, 10) === 0) {
      const data = await readJsonFile('awards.json');
      if (data && data.length > 0) {
        for (const item of data) {
          await db.query(
            'INSERT INTO awards (title, organization, date, description) VALUES ($1, $2, $3, $4)',
            [item.title, item.organization, item.date, item.description]
          );
        }
        console.log('Awards table seeded successfully.');
      }
    }

    // 10. Seed Contacts if empty
    const contactsCheck = await db.query('SELECT count(*) FROM contacts');
    if (parseInt(contactsCheck.rows[0].count, 10) === 0) {
      const data = await readJsonFile('contacts.json');
      if (data && data.length > 0) {
        for (const item of data) {
          await db.query(
            'INSERT INTO contacts (name, email, phone, message, submitted_at) VALUES ($1, $2, $3, $4, $5)',
            [item.name, item.email, item.phone, item.message, item.submittedAt]
          );
        }
        console.log('Contacts table seeded successfully.');
      }
    }

    console.log('Database initialization completed successfully.');
    return true;
  } catch (error) {
    console.error('Critical database initialization error:', error.message);
    return false;
  }
}

module.exports = initializeDatabase;
