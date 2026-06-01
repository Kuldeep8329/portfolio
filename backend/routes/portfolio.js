const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

router.get('/profile', portfolioController.getProfile);
router.get('/skills', portfolioController.getSkills);
router.get('/experience', portfolioController.getExperience);
router.get('/projects', portfolioController.getProjects);
router.get('/education', portfolioController.getEducation);
router.get('/certifications', portfolioController.getCertifications);
router.get('/awards', portfolioController.getAwards);
router.post('/contact', portfolioController.submitContact);

module.exports = router;
