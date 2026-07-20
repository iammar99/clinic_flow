const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

// GET /api/patients
// Fetch list of patients with search filtering and aggregate stats (total visits, last visit)
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const patients = await Patient.findAll({
      where: whereClause,
      include: [{
        model: Appointment,
        as: 'appointments',
        attributes: ['date', 'status']
      }],
      order: [['name', 'ASC']]
    });

    // Format output with computed properties
    const formattedPatients = patients.map(patient => {
      const appointments = patient.appointments || [];
      const completedVisits = appointments.filter(app => app.status === 'completed');
      const lastVisit = appointments.length > 0
        ? appointments.reduce((latest, current) => {
            return new Date(current.date) > new Date(latest.date) ? current : latest;
          }).date
        : null;

      return {
        id: patient.id,
        name: patient.name,
        phone: patient.phone,
        email: patient.email,
        notes: patient.notes,
        createdAt: patient.createdAt,
        totalVisits: appointments.length,
        completedVisits: completedVisits.length,
        lastVisit
      };
    });

    res.json(formattedPatients);
  } catch (error) {
    console.error('Fetch patients list error:', error);
    res.status(500).json({ error: 'Server error fetching patients list.' });
  }
});

// GET /api/patients/:id
// Fetch details of a single patient, including their full visit history sorted
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id, {
      include: [{
        model: Appointment,
        as: 'appointments',
        order: [['date', 'DESC'], ['time', 'DESC']]
      }]
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    // Sort appointments manually to ensure correct order
    const sortedAppointments = (patient.appointments || []).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB - dateA;
    });

    res.json({
      id: patient.id,
      name: patient.name,
      phone: patient.phone,
      email: patient.email,
      notes: patient.notes,
      createdAt: patient.createdAt,
      appointments: sortedAppointments
    });
  } catch (error) {
    console.error('Fetch patient details error:', error);
    res.status(500).json({ error: 'Server error fetching patient details.' });
  }
});

module.exports = router;
