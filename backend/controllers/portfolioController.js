const fs = require('fs').promises;
const path = require('path');

// Helper to get filepath of json data
const getDataFilePath = (filename) => {
  return path.join(__dirname, '../data', filename);
};

// Generic read helper
const readDataFile = async (filename, defaultValue = []) => {
  const filePath = getDataFilePath(filename);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error.message);
    return defaultValue;
  }
};

// Controllers
exports.getProfile = async (req, res) => {
  const profile = await readDataFile('profile.json', {});
  res.json(profile);
};

exports.getSkills = async (req, res) => {
  const skills = await readDataFile('skills.json', []);
  res.json(skills);
};

exports.getExperience = async (req, res) => {
  const experience = await readDataFile('experience.json', []);
  res.json(experience);
};

exports.getProjects = async (req, res) => {
  const projects = await readDataFile('projects.json', []);
  res.json(projects);
};

exports.getEducation = async (req, res) => {
  const education = await readDataFile('education.json', []);
  res.json(education);
};

exports.getCertifications = async (req, res) => {
  const certifications = await readDataFile('certifications.json', []);
  res.json(certifications);
};

exports.getAwards = async (req, res) => {
  const awards = await readDataFile('awards.json', []);
  res.json(awards);
};

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Server-side validation
    const errors = [];
    if (!name || name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Name must be at least 2 characters long.' });
    }
    
    // Basic email format check
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

    // Load existing contact submissions
    const contactsFile = getDataFilePath('contacts.json');
    let contacts = [];
    try {
      const data = await fs.readFile(contactsFile, 'utf8');
      contacts = JSON.parse(data);
    } catch (err) {
      // File may not exist yet, which is fine
      contacts = [];
    }

    // Append new submission
    const newSubmission = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      message: message.trim(),
      submittedAt: new Date().toISOString()
    };

    contacts.push(newSubmission);

    // Save back to file
    await fs.writeFile(contactsFile, JSON.stringify(contacts, null, 2), 'utf8');

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received successfully.'
    });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};
