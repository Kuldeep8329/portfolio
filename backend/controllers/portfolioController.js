const fs = require('fs').promises;
const path = require('path');
const db = require('../config/db');

// Helper to get filepath of json data
const getDataFilePath = (filename) => {
  return path.join(__dirname, '../data', filename);
};

// Generic read helper for local JSON files (fallback)
const readDataFile = async (filename, defaultValue = []) => {
  const filePath = getDataFilePath(filename);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading local file fallback ${filename}:`, error.message);
    return defaultValue;
  }
};

// Controllers
exports.getProfile = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM profile ORDER BY id ASC LIMIT 1');
    if (result.rows.length > 0) {
      return res.json(result.rows[0]);
    }
    // If table is empty, use JSON fallback
    const profile = await readDataFile('profile.json', {});
    res.json(profile);
  } catch (error) {
    console.warn('getProfile DB query failed, falling back to local JSON. Error:', error.message);
    const profile = await readDataFile('profile.json', {});
    res.json(profile);
  }
};

exports.getSkills = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM skills ORDER BY id ASC');
    if (result.rows.length > 0) {
      return res.json(result.rows);
    }
    const skills = await readDataFile('skills.json', []);
    res.json(skills);
  } catch (error) {
    console.warn('getSkills DB query failed, falling back to local JSON. Error:', error.message);
    const skills = await readDataFile('skills.json', []);
    res.json(skills);
  }
};

exports.getExperience = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM experience ORDER BY id ASC');
    if (result.rows.length > 0) {
      return res.json(result.rows);
    }
    const experience = await readDataFile('experience.json', []);
    res.json(experience);
  } catch (error) {
    console.warn('getExperience DB query failed, falling back to local JSON. Error:', error.message);
    const experience = await readDataFile('experience.json', []);
    res.json(experience);
  }
};

exports.getProjects = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM projects ORDER BY id ASC');
    if (result.rows.length > 0) {
      return res.json(result.rows);
    }
    const projects = await readDataFile('projects.json', []);
    res.json(projects);
  } catch (error) {
    console.warn('getProjects DB query failed, falling back to local JSON. Error:', error.message);
    const projects = await readDataFile('projects.json', []);
    res.json(projects);
  }
};

exports.getEducation = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM education ORDER BY id ASC');
    if (result.rows.length > 0) {
      return res.json(result.rows);
    }
    const education = await readDataFile('education.json', []);
    res.json(education);
  } catch (error) {
    console.warn('getEducation DB query failed, falling back to local JSON. Error:', error.message);
    const education = await readDataFile('education.json', []);
    res.json(education);
  }
};

exports.getCertifications = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM certifications ORDER BY id ASC');
    if (result.rows.length > 0) {
      return res.json(result.rows);
    }
    const certifications = await readDataFile('certifications.json', []);
    res.json(certifications);
  } catch (error) {
    console.warn('getCertifications DB query failed, falling back to local JSON. Error:', error.message);
    const certifications = await readDataFile('certifications.json', []);
    res.json(certifications);
  }
};

exports.getAwards = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM awards ORDER BY id ASC');
    if (result.rows.length > 0) {
      return res.json(result.rows);
    }
    const awards = await readDataFile('awards.json', []);
    res.json(awards);
  } catch (error) {
    console.warn('getAwards DB query failed, falling back to local JSON. Error:', error.message);
    const awards = await readDataFile('awards.json', []);
    res.json(awards);
  }
};

// Submit contact form (lead logging)
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Server-side validation
    const errors = [];
    if (!name || name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Name must be at least 2 characters long.' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'Please provide a valid email address.' });
    }

    if (!message || message.trim().length < 10) {
      errors.push({ field: 'message', message: 'Message must be at least 10 characters long.' });
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone ? phone.trim() : '';
    const trimmedMessage = message.trim();

    // 1. Try to save to PostgreSQL
    let dbSaved = false;
    try {
      await db.query(
        'INSERT INTO contacts (name, email, phone, message) VALUES ($1, $2, $3, $4)',
        [trimmedName, trimmedEmail, trimmedPhone, trimmedMessage]
      );
      dbSaved = true;
      console.log('Lead saved successfully to PostgreSQL database.');
    } catch (dbError) {
      console.warn('Failed to save lead in DB, will log in JSON file. Error:', dbError.message);
    }

    // 2. Always write to contacts.json as double safety/backup, or if DB is offline
    const contactsFile = getDataFilePath('contacts.json');
    let contacts = [];
    try {
      const data = await fs.readFile(contactsFile, 'utf8');
      contacts = JSON.parse(data);
    } catch (err) {
      contacts = [];
    }

    const newSubmission = {
      id: Date.now().toString(),
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      message: trimmedMessage,
      submittedAt: new Date().toISOString()
    };

    contacts.push(newSubmission);
    await fs.writeFile(contactsFile, JSON.stringify(contacts, null, 2), 'utf8');

    res.status(201).json({
      success: true,
      message: dbSaved 
        ? 'Thank you! Your message has been received successfully.' 
        : 'Thank you! Your message has been received and saved locally.'
    });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};
