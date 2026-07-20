const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue:"doctor@clinicflow.com",
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    defaultValue:"password123",
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    defaultValue: 'Dr. Ali Ahmed'
  },
  specialty: {
    type: DataTypes.STRING,
    defaultValue: 'Dermatologist'
  },
  qualifications: {
    type: DataTypes.STRING,
    defaultValue: 'MBBS, FCPS'
  },
  experience: {
    type: DataTypes.INTEGER,
    defaultValue: 12
  },
  languages: {
    type: DataTypes.JSON,
    defaultValue: ['English', 'Urdu']
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: 'Dr. Ali Ahmed is a highly qualified dermatologist with over 12 years of experience in clinical and cosmetic dermatology. He is dedicated to providing personalized skin care using state-of-the-art treatments.'
  },
  clinicAddress: {
    type: DataTypes.TEXT,
    defaultValue: 'Suite 402, Medical Center, Clifton, Karachi'
  },
  workingHours: {
    type: DataTypes.JSON,
    defaultValue: {
      Monday: { start: '09:00', end: '17:00' },
      Tuesday: { start: '09:00', end: '17:00' },
      Wednesday: { start: '09:00', end: '17:00' },
      Thursday: { start: '09:00', end: '17:00' },
      Friday: { start: '09:00', end: '13:00' },
      Saturday: { start: '10:00', end: '14:00' },
      Sunday: null
    }
  },
  services: {
    type: DataTypes.JSON,
    defaultValue: [
      { name: 'General Consultation', description: 'Comprehensive skin examination and treatment planning.', fee: 3000, duration: 30 },
      { name: 'Acne & Scar Treatment', description: 'Advanced therapies for active acne and acne scarring.', fee: 5000, duration: 30 },
      { name: 'Laser Hair Removal', description: 'Safe and effective permanent hair reduction with diode laser.', fee: 8000, duration: 45 },
      { name: 'Chemical Peel', description: 'Exfoliation treatment to improve skin texture and radiance.', fee: 6000, duration: 30 },
      { name: 'HydraFacial', description: 'Deep cleansing, exfoliation, and hydration for glowing skin.', fee: 7500, duration: 45 }
    ]
  },
  holidays: {
    type: DataTypes.JSON,
    defaultValue: [] // Array of 'YYYY-MM-DD' strings
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'doctors',
  timestamps: true,
  underscored: true
});

module.exports = Doctor;
