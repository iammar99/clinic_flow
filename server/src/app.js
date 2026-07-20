const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const appointmentRoutes = require('./routes/appointments');
const patientRoutes = require('./routes/patients');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Base Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ClinicFlow API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes); // includes /api/profile PUT
app.use('/api/public', profileRoutes);  // registers public routes like /api/public/doctor, /api/public/services
app.use('/api/public', appointmentRoutes); // registers /api/public/book
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
