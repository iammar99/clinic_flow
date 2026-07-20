const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');
const { sendWhatsAppNotification } = require('../utils/whatsapp');

// Helper to validate day of week and slot existence
function getDayName(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return daysOfWeek[d.getDay()];
}

// POST /api/public/book
// Create a new patient (if they don't exist by phone) and schedule an appointment
router.post('/book', async (req, res) => {
  try {
    const { patientName, patientPhone, patientEmail, serviceName, date, time, notes } = req.body;

    if (!patientName || !patientPhone || !serviceName || !date || !time) {
      return res.status(400).json({ error: 'Patient name, phone, service, date, and time are required.' });
    }

    // 1. Fetch Doctor config
    const doctor = await Doctor.findOne();
    if (!doctor) {
      return res.status(500).json({ error: 'Doctor configuration is missing.' });
    }

    // 2. Validate holidays
    if ((doctor.holidays || []).includes(date)) {
      return res.status(400).json({ error: 'The selected date is a clinic holiday.' });
    }

    // 3. Validate day of week working hours
    const dayName = getDayName(date);
    const schedule = doctor.workingHours[dayName];
    if (!schedule || !schedule.start || !schedule.end) {
      return res.status(400).json({ error: 'The clinic is closed on the selected day of the week.' });
    }

    // 4. Validate slot overlap
    const existingAppointment = await Appointment.findOne({
      where: {
        date,
        time,
        status: { [Op.in]: ['pending', 'confirmed', 'completed'] }
      }
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'The selected time slot is already booked.' });
    }

    // 5. Find or Create Patient
    let patient = await Patient.findOne({ where: { phone: patientPhone } });
    if (!patient) {
      patient = await Patient.create({
        name: patientName,
        phone: patientPhone,
        email: patientEmail,
        notes: `Patient registered via online booking. Initial booking notes: ${notes || 'None'}`
      });
    } else {
      // Update email if it was previously empty
      if (!patient.email && patientEmail) {
        patient.email = patientEmail;
        await patient.save();
      }
    }

    // 6. Create Appointment
    const appointment = await Appointment.create({
      patientId: patient.id,
      serviceName,
      date,
      time,
      status: 'pending',
      notes
    });

    // 7. Send WhatsApp notification
    const bookingMsg = `Hello ${patientName}, your appointment for "${serviceName}" at ClinicFlow with Dr. Ali Ahmed on ${date} at ${time} is requested. We will send you a confirmation message shortly.`;
    await sendWhatsAppNotification(patientPhone, bookingMsg);

    // Return populated appointment
    const responseData = await Appointment.findByPk(appointment.id, {
      include: [{ model: Patient, as: 'patient' }]
    });

    res.status(201).json(responseData);
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Server error during booking.' });
  }
});

// GET /api/appointments
// Protected route to fetch appointments with filter capabilities
router.get('/', auth, async (req, res) => {
  try {
    const { status, date, search } = req.query;
    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }
    if (date) {
      whereClause.date = date;
    }

    const patientWhere = {};
    if (search) {
      patientWhere.name = {
        [Op.iLike]: `%${search}%`
      };
    }

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [{
        model: Patient,
        as: 'patient',
        where: search ? patientWhere : undefined
      }],
      order: [
        ['date', 'ASC'],
        ['time', 'ASC']
      ]
    });

    res.json(appointments);
  } catch (error) {
    console.error('Fetch appointments error:', error);
    res.status(500).json({ error: 'Server error fetching appointments.' });
  }
});

// PUT /api/appointments/:id/status
// Protected route to change the status/notes of an appointment
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const appointment = await Appointment.findByPk(id, {
      include: [{ model: Patient, as: 'patient' }]
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    if (status !== undefined) {
      const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid appointment status.' });
      }
      appointment.status = status;
    }

    if (notes !== undefined) {
      appointment.notes = notes;
    }

    await appointment.save();

    // Send WhatsApp update if status was modified
    if (status !== undefined) {
      const patientName = appointment.patient.name;
      const serviceName = appointment.serviceName;
      const appDate = appointment.date;
      const appTime = appointment.time;
      let message = '';

      if (status === 'confirmed') {
        message = `Dear ${patientName}, your appointment for "${serviceName}" on ${appDate} at ${appTime} has been CONFIRMED by Dr. Ali Ahmed. See you soon!`;
      } else if (status === 'cancelled') {
        message = `Dear ${patientName}, your appointment for "${serviceName}" on ${appDate} at ${appTime} has been CANCELLED. Please contact the clinic for reschedule options.`;
      }

      if (message) {
        await sendWhatsAppNotification(appointment.patient.phone, message);
      }
    }

    res.json(appointment);
  } catch (error) {
    console.error('Update appointment status/notes error:', error);
    res.status(500).json({ error: 'Server error updating appointment details.' });
  }
});

module.exports = router;
