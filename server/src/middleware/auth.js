const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Since it's a single doctor platform, we fetch that doctor.
    const doctor = await Doctor.findByPk(decoded.id);
    if (!doctor) {
      return res.status(401).json({ error: 'Invalid token. Doctor not found.' });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
