const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find the doctor (only 1 doctor in system, but we match by email)
    const doctor = await Doctor.findOne({ where: { email } });
    if (!doctor) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Sign JWT
    const token = jwt.sign({ id: doctor.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', auth, (req, res) => {
  res.json({
    id: req.doctor.id,
    name: req.doctor.name,
    email: req.doctor.email,
    specialty: req.doctor.specialty,
    qualifications: req.doctor.qualifications,
    experience: req.doctor.experience,
    languages: req.doctor.languages,
    bio: req.doctor.bio,
    clinicAddress: req.doctor.clinicAddress,
    workingHours: req.doctor.workingHours,
    holidays: req.doctor.holidays,
    services: req.doctor.services
  });
});

module.exports = router;
