const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

// Helper to convert time string (HH:MM) to minutes
function timeToMinutes(tStr) {
  if (!tStr) return 0;
  const [h, m] = tStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

// Helper to convert minutes to time string (HH:MM)
function minutesToTime(mins) {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

// GET /api/public/doctor
// Retrieves the doctor profile. If ?date=YYYY-MM-DD is passed, computes available slots.
router.get('/doctor', async (req, res) => {
  try {
    const doctor = await Doctor.findOne();
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found.' });
    }

    const { date } = req.query;
    let availableSlots = [];
    let isClosed = false;
    let isHoliday = false;

    if (date) {
      // Validate date format YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
      }

      // Check holidays
      const holidays = doctor.holidays || [];
      if (holidays.includes(date)) {
        isHoliday = true;
      } else {
        // Parse date day of week
        const [year, month, day] = date.split('-').map(Number);
        const d = new Date(year, month - 1, day);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = daysOfWeek[d.getDay()];

        const schedule = doctor.workingHours[dayName];
        if (!schedule || !schedule.start || !schedule.end) {
          isClosed = true;
        } else {
          // Generate 30-minute slots
          const startMins = timeToMinutes(schedule.start);
          const endMins = timeToMinutes(schedule.end);

          // Get booked appointments for this date
          const bookedAppointments = await Appointment.findAll({
            where: {
              date,
              status: ['pending', 'confirmed', 'completed'] // Exclude cancelled ones
            },
            attributes: ['time']
          });

          const bookedTimes = bookedAppointments.map(app => app.time);

          for (let m = startMins; m < endMins; m += 30) {
            const timeStr = minutesToTime(m);
            if (!bookedTimes.includes(timeStr)) {
              availableSlots.push(timeStr);
            }
          }
        }
      }
    }

    res.json({
      doctor: {
        name: doctor.name,
        specialty: doctor.specialty,
        qualifications: doctor.qualifications,
        experience: doctor.experience,
        languages: doctor.languages,
        bio: doctor.bio,
        clinicAddress: doctor.clinicAddress,
        workingHours: doctor.workingHours,
        holidays: doctor.holidays,
        avatarUrl: doctor.avatarUrl
      },
      slotsInfo: date ? {
        date,
        isClosed,
        isHoliday,
        availableSlots
      } : null
    });
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    res.status(500).json({ error: 'Server error fetching doctor profile.' });
  }
});

// GET /api/public/services
// Retrieves the services list directly from Doctor model's JSON
router.get('/services', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ attributes: ['services'] });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }
    res.json(doctor.services || []);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Server error fetching services.' });
  }
});

// PUT /api/profile
// Protected route to update the doctor profile information
router.put('/', auth, async (req, res) => {
  try {
    const doctor = req.doctor;
    const {
      name,
      specialty,
      qualifications,
      experience,
      languages,
      bio,
      clinicAddress,
      workingHours,
      services,
      holidays,
      avatarUrl
    } = req.body;

    // Update fields if provided
    if (name !== undefined) doctor.name = name;
    if (specialty !== undefined) doctor.specialty = specialty;
    if (qualifications !== undefined) doctor.qualifications = qualifications;
    if (experience !== undefined) doctor.experience = experience;
    if (languages !== undefined) doctor.languages = languages;
    if (bio !== undefined) doctor.bio = bio;
    if (clinicAddress !== undefined) doctor.clinicAddress = clinicAddress;
    if (workingHours !== undefined) doctor.workingHours = workingHours;
    if (services !== undefined) doctor.services = services;
    if (holidays !== undefined) doctor.holidays = holidays;
    if (avatarUrl !== undefined) doctor.avatarUrl = avatarUrl;

    await doctor.save();

    res.json({
      message: 'Profile updated successfully.',
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
        qualifications: doctor.qualifications,
        experience: doctor.experience,
        languages: doctor.languages,
        bio: doctor.bio,
        clinicAddress: doctor.clinicAddress,
        workingHours: doctor.workingHours,
        services: doctor.services,
        holidays: doctor.holidays,
        avatarUrl: doctor.avatarUrl
      }
    });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    res.status(500).json({ error: 'Server error updating profile.' });
  }
});

module.exports = router;
