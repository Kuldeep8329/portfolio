const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_kuldeep_mahajan_8329';

// Secure password hashing helper
function hashPassword(password) {
  const salt = 'kuldeep_salt_8329';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// JSON Data file write helper
const writeDataFile = async (filename, data) => {
  const filePath = path.join(__dirname, '../data', filename);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Failed to write JSON backup file ${filename}:`, error.message);
  }
};

// JSON Data file read helper
const readDataFile = async (filename, defaultValue = []) => {
  const filePath = path.join(__dirname, '../data', filename);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return defaultValue;
  }
};

// Middleware: Authenticate Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Token missing.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Access denied. Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
}

// ----------------------------------------------------
// Public Auth Endpoints
// ----------------------------------------------------

// Admin Login with local JSON fallback
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  const trimmedUsername = username.trim();
  const passwordHash = hashPassword(password);

  try {
    // 1. Try PostgreSQL authentication
    const result = await db.query('SELECT * FROM admin_users WHERE username = $1', [trimmedUsername]);
    if (result.rows.length > 0) {
      const admin = result.rows[0];
      if (admin.password_hash === passwordHash) {
        const token = jwt.sign(
          { id: admin.id, username: admin.username },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        return res.json({
          success: true,
          message: 'Login successful (connected to database).',
          token
        });
      }
    }
    // If query succeeds but invalid credentials, reject immediately
    return res.status(401).json({ success: false, message: 'Invalid username or password.' });
  } catch (error) {
    console.warn('Database login failed, falling back to local JSON authentication. Error:', error.message);
    
    // 2. Local JSON backup authentication
    try {
      const adminUsersFile = path.join(__dirname, '../data/admin_users.json');
      let adminUsers = [];
      try {
        const fileContent = await fs.readFile(adminUsersFile, 'utf8');
        adminUsers = JSON.parse(fileContent);
      } catch (err) {
        // If file doesn't exist, create it with default credentials
        const defaultAdmin = {
          id: 1,
          username: 'admin',
          password_hash: hashPassword('admin123')
        };
        adminUsers = [defaultAdmin];
        await fs.writeFile(adminUsersFile, JSON.stringify(adminUsers, null, 2), 'utf8');
      }

      const admin = adminUsers.find(u => u.username === trimmedUsername);
      if (!admin || admin.password_hash !== passwordHash) {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        message: 'Login successful (offline/local mode).',
        token
      });
    } catch (localErr) {
      console.error('Local JSON login error:', localErr);
      return res.status(500).json({ success: false, message: 'Authentication server error.' });
    }
  }
});

// Change Password with local JSON fallback
router.post('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Old and new passwords are required.' });
  }

  const oldHash = hashPassword(oldPassword);
  const newHash = hashPassword(newPassword);

  try {
    // 1. Try DB change
    const result = await db.query('SELECT * FROM admin_users WHERE id = $1', [req.user.id]);
    if (result.rows.length > 0) {
      const admin = result.rows[0];
      if (admin.password_hash !== oldHash) {
        return res.status(400).json({ success: false, message: 'Incorrect old password.' });
      }
      await db.query('UPDATE admin_users SET password_hash = $1 WHERE id = $2', [newHash, req.user.id]);
    }
  } catch (error) {
    console.warn('Password change DB query failed, will apply to JSON backup. Error:', error.message);
  }

  // 2. Apply to local JSON backup
  try {
    const adminUsersFile = path.join(__dirname, '../data/admin_users.json');
    let adminUsers = [];
    try {
      const fileContent = await fs.readFile(adminUsersFile, 'utf8');
      adminUsers = JSON.parse(fileContent);
    } catch (err) {
      adminUsers = [];
    }

    const adminIdx = adminUsers.findIndex(u => u.username === req.user.username);
    if (adminIdx !== -1) {
      if (adminUsers[adminIdx].password_hash !== oldHash) {
        return res.status(400).json({ success: false, message: 'Incorrect old password.' });
      }
      adminUsers[adminIdx].password_hash = newHash;
    } else {
      // Add user if missing in JSON but authenticating via JWT
      adminUsers.push({
        id: req.user.id || 1,
        username: req.user.username,
        password_hash: newHash
      });
    }
    await fs.writeFile(adminUsersFile, JSON.stringify(adminUsers, null, 2), 'utf8');
    
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (localErr) {
    console.error('Local JSON password change error:', localErr);
    res.status(500).json({ success: false, message: 'Failed to update password locally.' });
  }
});

// Verify Auth State
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ success: true, username: req.user.username });
});

// ----------------------------------------------------
// Dashboard Combined Fetch
// ----------------------------------------------------

router.get('/portfolio-data', authenticateToken, async (req, res) => {
  try {
    const profile = await db.query('SELECT * FROM profile ORDER BY id ASC LIMIT 1');
    const skills = await db.query('SELECT * FROM skills ORDER BY id ASC');
    const experience = await db.query('SELECT * FROM experience ORDER BY id ASC');
    const projects = await db.query('SELECT * FROM projects ORDER BY id ASC');
    const education = await db.query('SELECT * FROM education ORDER BY id ASC');
    const certifications = await db.query('SELECT * FROM certifications ORDER BY id ASC');
    const awards = await db.query('SELECT * FROM awards ORDER BY id ASC');

    res.json({
      success: true,
      data: {
        profile: profile.rows[0] || null,
        skills: skills.rows,
        experience: experience.rows,
        projects: projects.rows,
        education: education.rows,
        certifications: certifications.rows,
        awards: awards.rows
      }
    });
  } catch (error) {
    console.warn('Admin portfolio-data DB query failed, falling back to local JSON data. Error:', error.message);
    
    // Query local JSON files
    const profile = await readDataFile('profile.json', null);
    const skills = await readDataFile('skills.json', []);
    const experience = await readDataFile('experience.json', []);
    const projects = await readDataFile('projects.json', []);
    const education = await readDataFile('education.json', []);
    const certifications = await readDataFile('certifications.json', []);
    const awards = await readDataFile('awards.json', []);

    res.json({
      success: true,
      data: {
        profile,
        skills,
        experience,
        projects,
        education,
        certifications,
        awards
      }
    });
  }
});

// ----------------------------------------------------
// CRUD Actions (requires Authentication)
// ----------------------------------------------------

// 1. Profile Update
router.put('/profile', authenticateToken, async (req, res) => {
  const { name, role, location, email, phone, summary, languages } = req.body;

  try {
    // Check if profile exists in DB
    const check = await db.query('SELECT id FROM profile ORDER BY id ASC LIMIT 1');
    let finalProfile;

    if (check.rows.length === 0) {
      // Create profile
      const result = await db.query(
        `INSERT INTO profile (name, role, location, email, phone, summary, languages)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, role, location, email, phone, summary, languages]
      );
      finalProfile = result.rows[0];
    } else {
      // Update profile
      const id = check.rows[0].id;
      const result = await db.query(
        `UPDATE profile 
         SET name = $1, role = $2, location = $3, email = $4, phone = $5, summary = $6, languages = $7
         WHERE id = $8 RETURNING *`,
        [name, role, location, email, phone, summary, languages, id]
      );
      finalProfile = result.rows[0];
    }

    // Sync to local JSON backup
    await writeDataFile('profile.json', finalProfile);
    res.json({ success: true, message: 'Profile updated successfully.', data: finalProfile });
  } catch (error) {
    console.warn('Profile DB update failed, falling back to local JSON. Error:', error.message);
    
    // Offline local JSON update
    const profileData = { name, role, location, email, phone, summary, languages };
    await writeDataFile('profile.json', profileData);
    res.json({ success: true, message: 'Profile updated successfully (local backup saved).', data: profileData });
  }
});

// Helper function to query all items in table and update local backup JSON file
const syncTableToJson = async (tableName, jsonFilename) => {
  const result = await db.query(`SELECT * FROM ${tableName} ORDER BY id ASC`);
  await writeDataFile(jsonFilename, result.rows);
};

// 2. Skills CRUD
router.post('/skills', authenticateToken, async (req, res) => {
  const { category, items } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO skills (category, items) VALUES ($1, $2) RETURNING *',
      [category, items]
    );
    await syncTableToJson('skills', 'skills.json');
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.warn('Skills DB add failed, falling back to JSON:', err.message);
    const skills = await readDataFile('skills.json', []);
    const newItem = { id: Date.now(), category, items };
    skills.push(newItem);
    await writeDataFile('skills.json', skills);
    res.status(201).json({ success: true, data: newItem });
  }
});

router.put('/skills/:id', authenticateToken, async (req, res) => {
  const { category, items } = req.body;
  const { id } = req.params;
  try {
    const result = await db.query(
      'UPDATE skills SET category = $1, items = $2 WHERE id = $3 RETURNING *',
      [category, items, id]
    );
    await syncTableToJson('skills', 'skills.json');
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.warn('Skills DB update failed, falling back to JSON:', err.message);
    const skills = await readDataFile('skills.json', []);
    const updatedSkills = skills.map(item => {
      if (String(item.id) === String(id)) {
        return { ...item, category, items };
      }
      return item;
    });
    await writeDataFile('skills.json', updatedSkills);
    res.json({ success: true, data: { id, category, items } });
  }
});

router.delete('/skills/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM skills WHERE id = $1', [id]);
    await syncTableToJson('skills', 'skills.json');
    res.json({ success: true, message: 'Skill deleted.' });
  } catch (err) {
    console.warn('Skills DB delete failed, falling back to JSON:', err.message);
    const skills = await readDataFile('skills.json', []);
    const filtered = skills.filter(item => String(item.id) !== String(id));
    await writeDataFile('skills.json', filtered);
    res.json({ success: true, message: 'Skill deleted (locally).' });
  }
});

// 3. Experience CRUD
router.post('/experience', authenticateToken, async (req, res) => {
  const { role, company, location, period, highlights } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO experience (role, company, location, period, highlights) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [role, company, location, period, highlights]
    );
    await syncTableToJson('experience', 'experience.json');
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.warn('Experience DB add failed, falling back to JSON:', err.message);
    const experience = await readDataFile('experience.json', []);
    const newItem = { id: Date.now(), role, company, location, period, highlights };
    experience.push(newItem);
    await writeDataFile('experience.json', experience);
    res.status(201).json({ success: true, data: newItem });
  }
});

router.put('/experience/:id', authenticateToken, async (req, res) => {
  const { role, company, location, period, highlights } = req.body;
  const { id } = req.params;
  try {
    const result = await db.query(
      'UPDATE experience SET role = $1, company = $2, location = $3, period = $4, highlights = $5 WHERE id = $6 RETURNING *',
      [role, company, location, period, highlights, id]
    );
    await syncTableToJson('experience', 'experience.json');
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.warn('Experience DB update failed, falling back to JSON:', err.message);
    const experience = await readDataFile('experience.json', []);
    const updated = experience.map(item => {
      if (String(item.id) === String(id)) {
        return { ...item, role, company, location, period, highlights };
      }
      return item;
    });
    await writeDataFile('experience.json', updated);
    res.json({ success: true, data: { id, role, company, location, period, highlights } });
  }
});

router.delete('/experience/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM experience WHERE id = $1', [id]);
    await syncTableToJson('experience', 'experience.json');
    res.json({ success: true, message: 'Experience deleted.' });
  } catch (err) {
    console.warn('Experience DB delete failed, falling back to JSON:', err.message);
    const experience = await readDataFile('experience.json', []);
    const filtered = experience.filter(item => String(item.id) !== String(id));
    await writeDataFile('experience.json', filtered);
    res.json({ success: true, message: 'Experience deleted (locally).' });
  }
});

// 4. Projects CRUD
router.post('/projects', authenticateToken, async (req, res) => {
  const { title, description, tech, link, github } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO projects (title, description, tech, link, github) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, tech, link, github]
    );
    await syncTableToJson('projects', 'projects.json');
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.warn('Projects DB add failed, falling back to JSON:', err.message);
    const projects = await readDataFile('projects.json', []);
    const newItem = { id: Date.now(), title, description, tech, link, github };
    projects.push(newItem);
    await writeDataFile('projects.json', projects);
    res.status(201).json({ success: true, data: newItem });
  }
});

router.put('/projects/:id', authenticateToken, async (req, res) => {
  const { title, description, tech, link, github } = req.body;
  const { id } = req.params;
  try {
    const result = await db.query(
      'UPDATE projects SET title = $1, description = $2, tech = $3, link = $4, github = $5 WHERE id = $6 RETURNING *',
      [title, description, tech, link, github, id]
    );
    await syncTableToJson('projects', 'projects.json');
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.warn('Projects DB update failed, falling back to JSON:', err.message);
    const projects = await readDataFile('projects.json', []);
    const updated = projects.map(item => {
      if (String(item.id) === String(id)) {
        return { ...item, title, description, tech, link, github };
      }
      return item;
    });
    await writeDataFile('projects.json', updated);
    res.json({ success: true, data: { id, title, description, tech, link, github } });
  }
});

router.delete('/projects/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM projects WHERE id = $1', [id]);
    await syncTableToJson('projects', 'projects.json');
    res.json({ success: true, message: 'Project deleted.' });
  } catch (err) {
    console.warn('Projects DB delete failed, falling back to JSON:', err.message);
    const projects = await readDataFile('projects.json', []);
    const filtered = projects.filter(item => String(item.id) !== String(id));
    await writeDataFile('projects.json', filtered);
    res.json({ success: true, message: 'Project deleted (locally).' });
  }
});

// 5. Education CRUD
router.post('/education', authenticateToken, async (req, res) => {
  const { degree, institution, location, period, details } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO education (degree, institution, location, period, details) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [degree, institution, location, period, details]
    );
    await syncTableToJson('education', 'education.json');
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.warn('Education DB add failed, falling back to JSON:', err.message);
    const education = await readDataFile('education.json', []);
    const newItem = { id: Date.now(), degree, institution, location, period, details };
    education.push(newItem);
    await writeDataFile('education.json', education);
    res.status(201).json({ success: true, data: newItem });
  }
});

router.put('/education/:id', authenticateToken, async (req, res) => {
  const { degree, institution, location, period, details } = req.body;
  const { id } = req.params;
  try {
    const result = await db.query(
      'UPDATE education SET degree = $1, institution = $2, location = $3, period = $4, details = $5 WHERE id = $6 RETURNING *',
      [degree, institution, location, period, details, id]
    );
    await syncTableToJson('education', 'education.json');
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.warn('Education DB update failed, falling back to JSON:', err.message);
    const education = await readDataFile('education.json', []);
    const updated = education.map(item => {
      if (String(item.id) === String(id)) {
        return { ...item, degree, institution, location, period, details };
      }
      return item;
    });
    await writeDataFile('education.json', updated);
    res.json({ success: true, data: { id, degree, institution, location, period, details } });
  }
});

router.delete('/education/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM education WHERE id = $1', [id]);
    await syncTableToJson('education', 'education.json');
    res.json({ success: true, message: 'Education deleted.' });
  } catch (err) {
    console.warn('Education DB delete failed, falling back to JSON:', err.message);
    const education = await readDataFile('education.json', []);
    const filtered = education.filter(item => String(item.id) !== String(id));
    await writeDataFile('education.json', filtered);
    res.json({ success: true, message: 'Education deleted (locally).' });
  }
});

// 6. Certifications CRUD
router.post('/certifications', authenticateToken, async (req, res) => {
  const { name, issuer, date, description, link } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO certifications (name, issuer, date, description, link) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, issuer, date, description, link]
    );
    await syncTableToJson('certifications', 'certifications.json');
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.warn('Certifications DB add failed, falling back to JSON:', err.message);
    const certifications = await readDataFile('certifications.json', []);
    const newItem = { id: Date.now(), name, issuer, date, description, link };
    certifications.push(newItem);
    await writeDataFile('certifications.json', certifications);
    res.status(201).json({ success: true, data: newItem });
  }
});

router.put('/certifications/:id', authenticateToken, async (req, res) => {
  const { name, issuer, date, description, link } = req.body;
  const { id } = req.params;
  try {
    const result = await db.query(
      'UPDATE certifications SET name = $1, issuer = $2, date = $3, description = $4, link = $5 WHERE id = $6 RETURNING *',
      [name, issuer, date, description, link, id]
    );
    await syncTableToJson('certifications', 'certifications.json');
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.warn('Certifications DB update failed, falling back to JSON:', err.message);
    const certifications = await readDataFile('certifications.json', []);
    const updated = certifications.map(item => {
      if (String(item.id) === String(id)) {
        return { ...item, name, issuer, date, description, link };
      }
      return item;
    });
    await writeDataFile('certifications.json', updated);
    res.json({ success: true, data: { id, name, issuer, date, description, link } });
  }
});

router.delete('/certifications/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM certifications WHERE id = $1', [id]);
    await syncTableToJson('certifications', 'certifications.json');
    res.json({ success: true, message: 'Certification deleted.' });
  } catch (err) {
    console.warn('Certifications DB delete failed, falling back to JSON:', err.message);
    const certifications = await readDataFile('certifications.json', []);
    const filtered = certifications.filter(item => String(item.id) !== String(id));
    await writeDataFile('certifications.json', filtered);
    res.json({ success: true, message: 'Certification deleted (locally).' });
  }
});

// 7. Awards CRUD
router.post('/awards', authenticateToken, async (req, res) => {
  const { title, organization, date, description } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO awards (title, organization, date, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, organization, date, description]
    );
    await syncTableToJson('awards', 'awards.json');
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.warn('Awards DB add failed, falling back to JSON:', err.message);
    const awards = await readDataFile('awards.json', []);
    const newItem = { id: Date.now(), title, organization, date, description };
    awards.push(newItem);
    await writeDataFile('awards.json', awards);
    res.status(201).json({ success: true, data: newItem });
  }
});

router.put('/awards/:id', authenticateToken, async (req, res) => {
  const { title, organization, date, description } = req.body;
  const { id } = req.params;
  try {
    const result = await db.query(
      'UPDATE awards SET title = $1, organization = $2, date = $3, description = $4 WHERE id = $5 RETURNING *',
      [title, organization, date, description, id]
    );
    await syncTableToJson('awards', 'awards.json');
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.warn('Awards DB update failed, falling back to JSON:', err.message);
    const awards = await readDataFile('awards.json', []);
    const updated = awards.map(item => {
      if (String(item.id) === String(id)) {
        return { ...item, title, organization, date, description };
      }
      return item;
    });
    await writeDataFile('awards.json', updated);
    res.json({ success: true, data: { id, title, organization, date, description } });
  }
});

router.delete('/awards/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM awards WHERE id = $1', [id]);
    await syncTableToJson('awards', 'awards.json');
    res.json({ success: true, message: 'Award deleted.' });
  } catch (err) {
    console.warn('Awards DB delete failed, falling back to JSON:', err.message);
    const awards = await readDataFile('awards.json', []);
    const filtered = awards.filter(item => String(item.id) !== String(id));
    await writeDataFile('awards.json', filtered);
    res.json({ success: true, message: 'Award deleted (locally).' });
  }
});

// 8. View Leads (Contacts submissions)
router.get('/leads', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contacts ORDER BY submitted_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.warn('Leads DB query failed, falling back to local JSON. Error:', error.message);
    const contactsFile = path.join(__dirname, '../data/contacts.json');
    try {
      const data = await fs.readFile(contactsFile, 'utf8');
      const leads = JSON.parse(data);
      res.json({ success: true, data: [...leads].reverse() }); // Newest first
    } catch (err) {
      res.json({ success: true, data: [] });
    }
  }
});

module.exports = router;
